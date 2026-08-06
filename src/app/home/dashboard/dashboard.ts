import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../_components/icon/icon';
import { NotificationTypeLabels, Pages, PurchaseTypeLabels, Titles } from '../../_shared/constants';
import { handle } from '../../_shared/http-handler';
import { formatDateToStringWithDots, getDayOfWeek } from '../../_shared/methods';
import {
  DashboardUpcomingReservationResponse,
  NotificationResponse,
  PurchaseType,
  UserDashboardResponse,
} from '../../_shared/types';
import { AuthService } from '../../_services/auth.service';
import { DashboardService } from '../../_services/dashboard.service';
import { SharedService } from '../../_services/shared.service';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, Icon, RouterLink],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);
  private readonly sharedService = inject(SharedService);

  protected readonly dashboard = signal<UserDashboardResponse | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly currentUser = computed(() => this.authService.currentUser());
  protected readonly activeMembership = computed(() => this.dashboard()?.activeMembership ?? null);
  protected readonly upcomingReservations = computed(() => this.dashboard()?.upcomingReservations ?? []);
  protected readonly additionalUpcomingReservations = computed(() => this.upcomingReservations().slice(1));
  protected readonly latestNotifications = computed(() => this.dashboard()?.latestNotifications ?? []);
  protected readonly getDayOfWeek = getDayOfWeek;
  protected readonly notificationTypeLabels = NotificationTypeLabels;
  protected readonly purchaseTypeLabels = PurchaseTypeLabels;

  ngOnInit(): void {
    this.sharedService.setTitle(Titles.Dashboard);
    this.sharedService.page.set(Pages.Dashboard);
    this.loadDashboard();
  }

  protected getReservationDateLabel(reservation: DashboardUpcomingReservationResponse): string {
    return `${getDayOfWeek(reservation.trainingStartTime)} ${formatDateToStringWithDots(new Date(reservation.trainingStartTime))}`;
  }

  protected formatTimeRange(startTime: string, endTime: string): string {
    const formatter = new Intl.DateTimeFormat('sr-Latn-RS', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });

    return `${formatter.format(new Date(startTime))} - ${formatter.format(new Date(endTime))}`;
  }

  protected getNotificationTypeLabel(notification: NotificationResponse): string {
    return this.notificationTypeLabels[notification.type];
  }

  protected getNotificationPreview(notification: NotificationResponse): string {
    return notification.message.replace(/\s+/g, ' ').trim().slice(0, 96);
  }

  protected getPurchaseTypeLabel(type: PurchaseType): string {
    return this.purchaseTypeLabels[type];
  }

  private loadDashboard(): void {
    this.dashboardService
      .getUserDashboard()
      .pipe(handle((response) => this.dashboard.set(response.data), (loading) => this.isLoading.set(loading)))
      .subscribe();
  }
}
