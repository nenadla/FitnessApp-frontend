import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Button } from '../../_components/button/button';
import { Icon } from '../../_components/icon/icon';
import { MobileDataCard } from '../../_components/mobile-data-card/mobile-data-card';
import { NotificationTypeLabels, Pages, Titles } from '../../_shared/constants';
import { handle } from '../../_shared/http-handler';
import { NotificationResponse, NotificationType } from '../../_shared/types';
import { AuthService } from '../../_services/auth.service';
import { NotificationsService } from '../../_services/notifications.service';
import { SharedService } from '../../_services/shared.service';
import { CreateNotificationDialog } from './create-notification-dialog/create-notification-dialog';
import { NotificationDetailDialog } from './notification-detail-dialog/notification-detail-dialog';

@Component({
  selector: 'app-notifications',
  imports: [Button, DatePipe, Icon, MatPaginatorModule, MatSortModule, MatTableModule, MobileDataCard],
  templateUrl: './notifications.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly sharedService = inject(SharedService);
  private readonly dialog = inject(MatDialog);
  private readonly sort = viewChild.required(MatSort);

  protected readonly dataSource = new MatTableDataSource<NotificationResponse>([]);
  protected readonly mobileNotifications = signal<NotificationResponse[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly isLoadingMore = signal(false);
  protected readonly currentPage = signal(1);
  protected readonly pageSize = signal(20);
  protected readonly paginatorLength = signal(0);
  protected readonly mobilePage = signal(1);
  protected readonly mobileHasNextPage = signal(false);
  protected readonly isAdmin = computed(() => this.authService.currentUser()?.role === 'Admin');
  protected readonly displayedColumns = computed(() =>
    this.isAdmin()
      ? ['title', 'message', 'type', 'sendEmail', 'createdAt', 'status']
      : ['title', 'message', 'type', 'createdAt', 'status'],
  );
  protected readonly typeLabels = NotificationTypeLabels;

  ngOnInit(): void {
    this.sharedService.setTitle(Titles.Notifications);
    this.sharedService.page.set(Pages.Notifications);
    this.loadNotifications();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort();
  }

  protected changePage(event: PageEvent): void {
    this.loadTablePage(event.pageIndex + 1, event.pageSize);
  }

  protected loadMoreMobile(): void {
    if (!this.mobileHasNextPage() || this.isLoadingMore()) return;

    this.notificationsService.getAll(this.isAdmin(), { page: this.mobilePage() + 1, pageSize: 20 })
      .pipe(handle((response) => {
        this.mobileNotifications.update((notifications) => [...notifications, ...response.data.items]);
        this.mobilePage.set(response.data.page);
        this.mobileHasNextPage.set(response.data.page < response.data.totalPages);
      }, (loading) => this.isLoadingMore.set(loading)))
      .subscribe();
  }

  protected openCreateDialog(): void {
    this.dialog.open(CreateNotificationDialog, { autoFocus: false, maxWidth: 'calc(100vw - 2rem)', width: '40rem' }).afterClosed()
      .subscribe((request) => {
        if (!request) return;
        this.notificationsService.createGlobal(request)
          .pipe(handle(() => this.completeCreation(), (loading) => this.isLoading.set(loading)))
          .subscribe();
      });
  }

  protected notificationDetails(notification: NotificationResponse) {
    const details = [{ label: 'Poruka', value: notification.message }];

    if (this.isAdmin()) {
      details.push({ label: 'Email', value: notification.sendEmail ? 'Da' : 'Ne' });
    }

    return details;
  }

  protected getNotificationStatusLabel(notification: NotificationResponse): string {
    if (notification.isRead) {
      return 'Procitano';
    }

    return this.isNotificationStaro(notification) ? 'Starije' : 'Novo';
  }

  protected isNotificationStaro(notification: NotificationResponse): boolean {
    if (notification.isRead) {
      return false;
    }

    return Date.now() - new Date(notification.createdAt).getTime() >= 2 * 24 * 60 * 60 * 1000;
  }

  protected openDetails(notification: NotificationResponse): void {
    this.dialog.open(NotificationDetailDialog, {
      autoFocus: false,
      data: { notification, isAdmin: this.isAdmin() },
      maxWidth: 'calc(100vw - 2rem)',
      width: '36rem',
    });
  }

  protected getNotificationTypeLabel(type: NotificationType): string {
    return this.typeLabels[type];
  }

  private loadNotifications(): void {
    this.notificationsService.getAll(this.isAdmin(), { page: 1, pageSize: this.pageSize() })
      .pipe(handle((response) => {
        this.setTablePage(response.data.items, response.data.page, response.data.pageSize, response.data.totalCount);
        this.mobileNotifications.set(response.data.items);
        this.mobilePage.set(response.data.page);
        this.mobileHasNextPage.set(response.data.page < response.data.totalPages);
      }, (loading) => this.isLoading.set(loading)))
      .subscribe();
  }

  private loadTablePage(page: number, pageSize: number): void {
    this.notificationsService.getAll(this.isAdmin(), { page, pageSize })
      .pipe(handle((response) => this.setTablePage(
        response.data.items,
        response.data.page,
        response.data.pageSize,
        response.data.totalCount,
      ), (loading) => this.isLoading.set(loading)))
      .subscribe();
  }

  private setTablePage(items: NotificationResponse[], page: number, pageSize: number, totalCount: number): void {
    this.dataSource.data = items;
    this.currentPage.set(page);
    this.pageSize.set(pageSize);
    this.paginatorLength.set(totalCount);
  }

  private completeCreation(): void {
    this.sharedService.toast.set({ show: true, title: 'Uspeh', text: 'Notifikacija je uspešno poslata.', type: 'success' });
    this.loadNotifications();
  }
}
