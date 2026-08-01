import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Button } from '../../../_components/button/button';
import { Icon } from '../../../_components/icon/icon';
import { getDayOfWeek } from '../../../_shared/methods';
import { TrainingCalendarResponse } from '../../../_shared/types';

@Component({
  selector: 'app-training-card',
  imports: [Button, DatePipe, Icon],
  templateUrl: './training-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingCard {
  training = input.required<TrainingCalendarResponse>();
  isReserved = input(false);
  canReserve = input(false);
  isSubmitting = input(false);
  reserve = output<void>();
  cancel = output<void>();

  protected readonly getDayOfWeek = getDayOfWeek;
}
