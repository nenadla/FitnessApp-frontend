import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { handle } from '../../_shared/http-handler';
import { Pages, Titles } from '../../_shared/constants';
import { MembershipHistoryResponse } from '../../_shared/types';
import { SharedService } from '../../_services/shared.service';
import { MembershipsService } from '../../_services/memberships.service';
import { MembershipCardComponent } from './membership-card/membership-card';

@Component({
  selector: 'app-memberships',
  imports: [MembershipCardComponent],
  templateUrl: './memberships.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MembershipsComponent implements OnInit {
  private readonly membershipsService = inject(MembershipsService);
  private readonly sharedService = inject(SharedService);

  protected readonly isLoading = signal(false);
  protected readonly memberships = signal<MembershipHistoryResponse[]>([]);

  ngOnInit(): void {
    this.sharedService.setTitle(Titles.Memberships);
    this.sharedService.page.set(Pages.Memberships);
    this.loadMemberships();
  }

  protected hasAnyMemberships(): boolean {
    return this.memberships().length > 0;
  }

  private loadMemberships(): void {
    this.membershipsService
      .getHistory()
      .pipe(
        handle(
          (response) => {
            this.memberships.set(
              [...response.data].sort((a, b) => {
                if (a.isCurrentlyActive !== b.isCurrentlyActive) {
                  return a.isCurrentlyActive ? -1 : 1;
                }

                return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
              }),
            );
          },
          (loading) => this.isLoading.set(loading),
        ),
      )
      .subscribe();
  }
}
