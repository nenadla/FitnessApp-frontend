import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../../../_components/icon/icon';
import { PurchaseTypeLabels } from '../../../_shared/constants';
import { MembershipHistoryResponse } from '../../../_shared/types';

@Component({
  selector: 'app-membership-card',
  imports: [DatePipe, Icon],
  templateUrl: './membership-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MembershipCardComponent {
  membership = input.required<MembershipHistoryResponse>();
  protected readonly purchaseTypeLabels = PurchaseTypeLabels;
}
