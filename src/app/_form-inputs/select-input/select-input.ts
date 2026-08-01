import { ChangeDetectionStrategy, Component, DestroyRef, inject, Injector, input, OnInit, output, signal } from '@angular/core';
import { SharedModule } from '../../_shared/shared.module';
import { FormControl } from '@angular/forms';
import { Field, FieldState, form } from '@angular/forms/signals';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Icon } from '../../_components/icon/icon';
import { Skeleton } from "../../_components/skeleton/skeleton.";
import { debounceTime, distinctUntilChanged, skip } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { getFormFirstErrorMessage } from '../../_shared/methods';

@Component({
    selector: 'app-select-input',
    imports: [SharedModule, MatSelectModule, MatFormFieldModule, Icon, Skeleton],
    templateUrl: './select-input.html',
    styleUrl: './select-input.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectInput implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  label = input.required<string>();
  info = input('');
  placeholder = input<string>('');
  icon = input<'organizations' | 'calendar' | 'file-check' | ''>('');
  options = input.required<string[] | number[]>();
  values = input.required<any[]>();
  multiple = input<boolean>(false);
  showNone = input<boolean>(false);
  loading = input<boolean>(false);
  showErrorSpan = input<boolean>(true);
  enableClear = input(true);
  // Legacy compat: declared so existing [control] consumer bindings still compile. Not used internally.
  control = input<FormControl>(new FormControl(''));
  field = input<Field<any>>(form(signal<any>(null)) as unknown as Field<any>);
  onChange = output<any>();

  isFocused = signal(false);

  private get state(): FieldState<any> { return this.field()(); }

  isRequired(): boolean { return this.state.required(); }
  isTouched(): boolean { return this.state.touched(); }
  isInvalid(): boolean { return this.state.invalid(); }
  showErrors(): boolean { return this.isTouched() && this.isInvalid(); }
  fieldValue(): any { return this.state.value(); }
  isEnabled(): boolean { return !this.state.disabled(); }
  firstErrorMessage(): string {
    return getFormFirstErrorMessage(this.state.errors());
  }
  clearValue(): void { this.state.value.set(this.multiple() ? [] : null); }

  hasValue(): boolean {
    const v = this.fieldValue();
    if (v === null || v === undefined || v === '') return false;
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  }

  ngOnInit(): void {
    toObservable(this.state.value, { injector: this.injector }).pipe(
      skip(1),
      debounceTime(20),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value) => {
      this.onChange.emit(value);
    });
  }

  getSelectedOption(value: any){
    return this.options()[this.values().findIndex(f => f === value)];
  }

  removeItem(index: number, event: MouseEvent) {
    event.stopPropagation();
    const current: any[] = [...((this.fieldValue() as any[]) ?? [])];
    current.splice(index, 1);
    this.state.value.set(current);
  }
}
