import { ChangeDetectionStrategy, Component, DestroyRef, inject, Injector, input, output, signal, type OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Field, FieldState, FormField, form } from '@angular/forms/signals';

import { debounceTime, distinctUntilChanged, skip } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { getFormFirstErrorMessage } from '../../_shared/methods';

@Component({
  selector: 'app-textarea-input',
  imports: [FormField],
  templateUrl: './textarea-input.html',
  styleUrl: './textarea-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaInput implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  label = input.required<string>();
  placeholder = input<string>('');
  info = input('');
  // Legacy compat: declared so existing [control] consumer bindings still compile. Not used internally.
  control = input<FormControl>(new FormControl(''));
  field = input<Field<any>>(form(signal('')) as unknown as Field<any>);
  onChange = output<any>();
  isFocused = signal(false);

  private get state(): FieldState<any> { return this.field()(); }

  isRequired(): boolean { return this.state.required(); }
  isTouched(): boolean { return this.state.touched(); }
  isInvalid(): boolean { return this.state.invalid(); }
  showErrors(): boolean { return this.isTouched() && this.isInvalid(); }
  fieldValue(): any { return this.state.value(); }
  firstErrorMessage(): string {
    return getFormFirstErrorMessage(this.state.errors());
  }

  ngOnInit(): void {
    toObservable(this.state.value, { injector: this.injector }).pipe(
      skip(1),
      debounceTime(100),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value) => {
      this.onChange.emit(value);
    });
  }
}
