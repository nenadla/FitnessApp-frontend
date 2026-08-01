import { ChangeDetectionStrategy, Component, DestroyRef, inject, Injector, input, output, signal, type OnInit } from '@angular/core';
import { SharedModule } from '../../_shared/shared.module';
import { FormControl } from '@angular/forms';
import { Field, FieldState, form } from '@angular/forms/signals';
import { distinctUntilChanged, skip } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { SharedService } from '../../_services/shared.service';
import { equalFile, getFormFirstErrorMessage } from '../../_shared/methods';
import { Icon } from '../../_components/icon/icon';
import { Button } from '../../_components/button/button';
import { ButtonIcon } from '../../_components/button-icon/button-icon';

@Component({
  selector: 'app-file-input',
  imports: [SharedModule, Icon, Button, ButtonIcon],
  templateUrl: './file-input.html',
  styleUrl: './file-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInput implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  sharedService = inject(SharedService);

  multiple = input(false);
  disabled = input(false);
  accept = input('.pdf,.doc,.docx,.xls,.xlsx,.csv,image/*');
  maxSizeMb = input(100);
  onChange = output<File[] | null>();
  // Legacy compat: declared so existing [control] consumer bindings still compile. Not used internally.
  control = input<FormControl<File[] | null>>(new FormControl<File[] | null>([]));
  field = input<Field<File[] | null>>(form(signal<File[] | null>([])) as unknown as Field<File[] | null>);

  hover = signal(false);
  hasEnter = false;

  private get state(): FieldState<File[] | null> { return this.field()(); }

  isRequired(): boolean { return this.state.required(); }
  isTouched(): boolean { return this.state.touched(); }
  isInvalid(): boolean { return this.state.invalid(); }
  showErrors(): boolean { return this.isTouched() && this.isInvalid(); }
  files(): File[] { return this.state.value() ?? []; }
  firstErrorMessage(): string {
    return getFormFirstErrorMessage(this.state.errors());
  }

  private isAcceptedFile(file: File): boolean {
    const acceptedTypes = this.accept()
      .split(',')
      .map(type => type.trim().toLowerCase())
      .filter(Boolean);

    return acceptedTypes.some(type => {
      if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type);
      if (type.endsWith('/*')) return file.type.toLowerCase().startsWith(type.slice(0, -1));
      return file.type.toLowerCase() === type;
    });
  }

  private showInvalidType(file: File): void {
    this.sharedService.toast.set({ show: true, title: 'Invalid file type', text: `File "${file.name}" has an unsupported format and was skipped.`, type: 'error' });
  }

  ngOnInit(): void {
    toObservable(this.state.value, { injector: this.injector }).pipe(
      skip(1),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value) => {
      this.onChange.emit(value);
    });
  }

  onRemove(index: number) {
    const filtered = (this.state.value() ?? []).filter((_, idx) => idx !== index);
    this.state.value.set(filtered);
    this.state.markAsTouched();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.onEnter();
  }

  onEnter() {
    if (!this.hasEnter) {
      this.hover.set(true);
      this.hasEnter = true;
    }
  }
  onLeave() {
    this.hasEnter = false;
    this.hover.set(false);
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files || []);
    for (const file of files) {
      if (!this.isAcceptedFile(file)) {
        this.showInvalidType(file);
        continue;
      }

      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > this.maxSizeMb()) {
        this.sharedService.toast.set({ show: true, title: 'Max file size reached', text: `File "${file.name}" is larger than ${this.maxSizeMb()} MB and was skipped.`, type: 'error' });
        continue;
      }

      if (this.multiple()) {
        const current = this.state.value() ?? [];
        if (!current.find(f => equalFile(f, file))) {
          this.state.value.set([...current, file]);
        }
      } else {
        this.state.value.set([file]);
      }
    }

    this.state.markAsTouched();
  }

  async uploadFile() {
    if (this.disabled()) return;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = this.accept();
    fileInput.multiple = this.multiple();
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    fileInput.addEventListener('change', async (event) => {
      const target = event.target as HTMLInputElement;
      const files = Array.from(target.files || []);
      for (const file of files) {
        if (!this.isAcceptedFile(file)) {
          this.showInvalidType(file);
          continue;
        }

        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > this.maxSizeMb()) {
          this.sharedService.toast.set({ show: true, title: 'Max file size reached', text: `File "${file.name}" is larger than ${this.maxSizeMb()} MB and was skipped.`, type: 'error' });
          continue;
        }

        if (this.multiple()) {
          const current = this.state.value() ?? [];
          if (!current.find(f => equalFile(f, file))) {
            this.state.value.set([...current, file]);
          }
        } else {
          this.state.value.set([file]);
        }
      }

      this.state.markAsTouched();
      document.body.removeChild(fileInput);
    });

    fileInput.click();
  }
}
