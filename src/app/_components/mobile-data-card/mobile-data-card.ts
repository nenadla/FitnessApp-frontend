import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MobileDataCardDetail, MobileDataCardStatusTone } from '../../_shared/types';

@Component({
  selector: 'app-mobile-data-card',
  templateUrl: './mobile-data-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileDataCard {
  title = input.required<string>();
  subtitle = input('');
  status = input('');
  statusTone = input<MobileDataCardStatusTone>('success');
  details = input<readonly MobileDataCardDetail[]>([]);
  showActions = input(true);
}
