import { ChangeDetectionStrategy, Component, DestroyRef, inject, Injector, input, OnInit, output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Field, FieldState, FormField, form } from '@angular/forms/signals';

import { debounceTime, distinctUntilChanged, skip } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Icon } from '../../_components/icon/icon';

@Component({
    selector: 'app-search-input',
    imports: [Icon, FormField],
    templateUrl: './search-input.html',
    styleUrl: './search-input.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchInputComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  placeholder = input.required<string>();
  // Legacy compat: declared so existing [control] consumer bindings still compile. Not used internally.
  control = input<FormControl>(new FormControl(''));
  field = input<Field<any>>(form(signal('')) as unknown as Field<any>);
  onChange = output<string>();
  isFocused = signal(false);

  private get state(): FieldState<any> { return this.field()(); }

  fieldValue(): any { return this.state.value(); }
  isEnabled(): boolean { return !this.state.disabled(); }
  clearValue(): void { this.state.value.set(''); }

  ngOnInit(): void {
    toObservable(this.state.value, { injector: this.injector }).pipe(
      skip(1),
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value) => {
      this.onChange.emit(value);
    });
  }
}
