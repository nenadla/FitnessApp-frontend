import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { SelectInput } from '../select-input/select-input';

@Component({
  selector: 'app-time-input',
  imports: [SelectInput],
  templateUrl: './time-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeInput {
  label = input.required<string>();
  field = input<Field<any>>(form(signal('')) as unknown as Field<any>);

  protected readonly timeOptions = Array.from({ length: 48 }, (_, index) => {
    const hours = Math.floor(index / 2).toString().padStart(2, '0');
    const minutes = index % 2 === 0 ? '00' : '30';

    return `${hours}:${minutes}`;
  });
}
