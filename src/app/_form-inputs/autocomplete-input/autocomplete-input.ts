import { ChangeDetectionStrategy, Component, DestroyRef, AfterViewInit, inject, Injector, OnInit, input, output, signal, viewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Field, FieldState, form } from '@angular/forms/signals';
import { SharedModule } from '../../_shared/shared.module';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Icon } from '../../_components/icon/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs';
import { getFormFirstErrorMessage } from '../../_shared/methods';

export interface AutocompleteTableOption {
  value: string;
  columns: string[];
}

@Component({
    selector: 'app-autocomplete-input',
    templateUrl: './autocomplete-input.html',
    styleUrl: './autocomplete-input.css',
    imports: [SharedModule, MatAutocompleteModule, Icon, ScrollingModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteInput implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  matAutocomplete = viewChild<MatAutocomplete>('auto');

  label = input.required<string>();
  info = input('');
  placeholder = input<string>();
  showErrorSpan = input<boolean>(true);
  loading = input<boolean>(false);
  options = input.required<string[]>();
  icon = input<string>('');
  onSelect = output<string>();
  // Legacy compat: declared so existing [control] consumer bindings still compile. Not used internally.
  control = input<FormControl>(new FormControl(''));
  field = input<Field<any>>(form(signal('')) as unknown as Field<any>);
  onChange = output<string>();
  isFocused = signal(false);

  selectedOptions = input<any[]>([]);
  removeSelected = output<number>();
  tableColumns = input<string[] | null>(null);
  tableOptions = input<AutocompleteTableOption[] | null>(null);
  tableColumnWidths = input<string[]>([]);

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
  clearValue(): void { this.state.value.set(null); }

  ngOnInit() {
    toObservable(this.state.value, { injector: this.injector }).pipe(
      skip(1),
      debounceTime(50),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      if (value === '') {
        this.matAutocomplete()?.options.forEach(option => option.deselect());
      } else {
        this.syncSelectedOption(value);
      }
      this.onChange.emit(value);
    });
  }

  ngAfterViewInit() {
    this.syncSelectedOption(this.fieldValue());
  }

  private syncSelectedOption(value: string | null) {
    if (!value) return;
    this.matAutocomplete()?.options?.forEach(option => {
      if (option.value === value) {
        if (!option.selected) option.select(false);
      } else {
        if (option.selected) option.deselect(false);
      }
    });
  }

  parseOption(option: string): { col1: string; col2: string } | null {
    if (!this.tableColumns()) return null;
    const match = option.match(/^(.+?)\s*\(([^)]+)\)$/);
    return match ? { col1: match[1].trim(), col2: match[2].trim() } : null;
  }

  tableColumnWidth(index: number): string {
    const widths = this.tableColumnWidths();
    if (widths[index]) return widths[index];
    const columns = this.tableColumns();
    return columns?.length ? `${100 / columns.length}%` : 'auto';
  }
}
