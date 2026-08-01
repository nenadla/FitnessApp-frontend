import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, Injector, input, OnInit, output, signal } from '@angular/core';
import { SharedModule } from '../../_shared/shared.module';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormGroup, FormControl } from '@angular/forms';
import { Field, FieldState, form } from '@angular/forms/signals';
import { Icon } from '../../_components/icon/icon';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { CustomDateAdapter } from '../../_shared/adapters/datepicker.adapter';
import { MY_DATE_FORMAT } from '../../_shared/constants';
import { getFormFirstErrorMessage } from '../../_shared/methods';

export interface DateRangeValue {
  start: Date | null;
  end: Date | null;
}

/**
 * Date range input. Material's `mat-date-range-input` requires a real `FormGroup` with
 * `formControlName` children, so we keep an internal `FormGroup` as a Material driver and
 * sync it both ways with the signal-forms `field` (which is the public API for new consumers).
 */
@Component({
    selector: 'app-date-range-input',
    imports: [SharedModule, MatDatepickerModule, MatNativeDateModule, Icon],
    templateUrl: './date-range-input.html',
    styleUrl: './date-range-input.css',
    providers: [
      { provide: DateAdapter, useClass: CustomDateAdapter },
      { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateRangeInput implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  label = input.required<string>();
  // Legacy compat: declared so existing [form] consumer bindings still compile. Not used internally.
  form = input<FormGroup>(new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  }));
  field = input<Field<DateRangeValue>>(form(signal<DateRangeValue>({ start: null, end: null })) as unknown as Field<DateRangeValue>);
  onChange = output<DateRangeValue>();

  // Internal Material driver — bound to mat-date-range-input via [formGroup].
  bridgeForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  private get state(): FieldState<DateRangeValue> { return this.field()(); }

  isRequired(): boolean { return this.state.required(); }
  isTouched(): boolean { return this.state.touched(); }
  isInvalid(): boolean { return this.state.invalid(); }
  showErrors(): boolean { return this.isTouched() && this.isInvalid(); }
  fieldStart(): Date | null { return this.state.value().start; }
  fieldEnd(): Date | null { return this.state.value().end; }
  firstErrorMessage(): string {
    return getFormFirstErrorMessage(this.state.errors());
  }
  clearValue(): void { this.state.value.set({ start: null, end: null }); }

  constructor() {
    // Field → bridge (e.g., programmatic resets from outside).
    effect(() => {
      const v = this.state.value();
      const cur = this.bridgeForm.getRawValue();
      if (cur.start !== v.start || cur.end !== v.end) {
        this.bridgeForm.setValue({ start: v.start, end: v.end }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    // Bridge → field (user picks dates from Material picker).
    this.bridgeForm.valueChanges.pipe(
      debounceTime(50),
      distinctUntilChanged((a, b) => a.start === b.start && a.end === b.end),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((v) => {
      const next = { start: v.start ?? null, end: v.end ?? null };
      const cur = this.state.value();
      if (cur.start !== next.start || cur.end !== next.end) {
        this.state.value.set(next);
      }
    });

    // Emit only when both filled or both cleared, matching legacy behavior.
    toObservable(this.state.value, { injector: this.injector }).pipe(
      skip(1),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((dates) => {
      if ((dates.end && dates.start) || (!dates.end && !dates.start)) {
        this.onChange.emit(dates);
      }
    });
  }
}
