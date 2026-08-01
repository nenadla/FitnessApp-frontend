import { ChangeDetectionStrategy, Component, DestroyRef, inject, Injector, input, output, signal, type OnInit } from '@angular/core';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Icon } from '../../_components/icon/icon';
import { CustomDateAdapter } from '../../_shared/adapters/datepicker.adapter';
import { SharedModule } from '../../_shared/shared.module';
import { FormControl } from '@angular/forms';
import { Field, FieldState, form } from '@angular/forms/signals';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MY_DATE_FORMAT } from '../../_shared/constants';
import { getFormFirstErrorMessage } from '../../_shared/methods';

@Component({
  selector: 'app-date-input',
  imports: [SharedModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, Icon],
  templateUrl: './date-input.html',
  styleUrl: './date-input.css',
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInput implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  label = input.required<string>();
  // Legacy compat: declared so existing [control] consumer bindings still compile. Not used internally.
  control = input<FormControl>(new FormControl<Date | null>(null));
  field = input<Field<any>>(form(signal<Date | null>(null)) as unknown as Field<any>);
  min = input<Date | null>(null);
  max = input<Date | null>(null);
  onChange = output<any>();

  pickerOpened = signal(false);

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

  ngOnInit(): void {
    toObservable(this.state.value, { injector: this.injector }).pipe(
      skip(1),
      debounceTime(50),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value) => {
      this.onChange.emit(value);
    });
  }
}
