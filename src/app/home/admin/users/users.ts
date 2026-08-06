import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AreYouSureDialog } from '../../../_components/are-you-sure-dialog/are-you-sure-dialog';
import { Button } from '../../../_components/button/button';
import { ButtonIcon } from '../../../_components/button-icon/button-icon';
import { Icon } from '../../../_components/icon/icon';
import { MobileDataCard } from '../../../_components/mobile-data-card/mobile-data-card';
import { Pages, Titles, UserStatusLabels } from '../../../_shared/constants';
import { handle } from '../../../_shared/http-handler';
import { dateTimeValueFormatter } from '../../../_shared/methods';
import { MobileDataCardStatusTone, UserListResponse, UserStatus, UserStatusAction } from '../../../_shared/types';
import { SharedService } from '../../../_services/shared.service';
import { UsersService } from '../../../_services/users.service';
import { UserStatusDialog } from './user-status-dialog/user-status-dialog';

@Component({
  selector: 'app-admin-users',
  imports: [Button, ButtonIcon, DatePipe, Icon, MatPaginatorModule, MatSortModule, MatTableModule, MobileDataCard],
  templateUrl: './users.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersComponent implements AfterViewInit, OnInit {
  private readonly sharedService = inject(SharedService);
  private readonly usersService = inject(UsersService);
  private readonly dialog = inject(MatDialog);
  private readonly sort = viewChild.required(MatSort);

  protected readonly displayedColumns = ['name', 'email', 'phoneNumber', 'status', 'createdAt', 'verifiedAt', 'actions'];
  protected readonly dataSource = new MatTableDataSource<UserListResponse>([]);
  protected readonly mobileUsers = signal<UserListResponse[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly isLoadingMore = signal(false);
  protected readonly currentPage = signal(1);
  protected readonly pageSize = signal(20);
  protected readonly paginatorLength = signal(0);
  protected readonly mobilePage = signal(1);
  protected readonly mobileHasNextPage = signal(false);
  protected readonly userStatusLabels = UserStatusLabels;
  protected readonly UserStatus = UserStatus;

  ngOnInit(): void {
    this.sharedService.setTitle(Titles.AdminUsers);
    this.sharedService.page.set(Pages.AdminUsers);
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort();
  }

  protected changePage(event: PageEvent): void {
    this.loadTablePage(event.pageIndex + 1, event.pageSize);
  }

  protected loadMoreMobile(): void {
    if (!this.mobileHasNextPage() || this.isLoadingMore()) return;

    this.usersService.getAll({ page: this.mobilePage() + 1, pageSize: 20 })
      .pipe(handle((response) => {
        this.mobileUsers.update((users) => [...users, ...response.data.items]);
        this.mobilePage.set(response.data.page);
        this.mobileHasNextPage.set(response.data.page < response.data.totalPages);
      }, (loading) => this.isLoadingMore.set(loading)))
      .subscribe();
  }

  protected getStatusLabel(status: UserStatus): string {
    return this.userStatusLabels[status];
  }

  protected getStatusTone(status: UserStatus): MobileDataCardStatusTone {
    if (status === UserStatus.Blocked) {
      return 'error';
    }

    return status === UserStatus.Unverified ? 'primary' : 'success';
  }

  protected userDetails(user: UserListResponse) {
    return [
      { label: 'Email', value: user.email },
      { label: 'Telefon', value: user.phoneNumber || '-' },
      { label: 'Registrovan', value: dateTimeValueFormatter({ value: user.createdAt }) },
      { label: 'Verifikovan', value: user.verifiedAt ? dateTimeValueFormatter({ value: user.verifiedAt }) : '-' },
    ];
  }

  protected openStatusDialog(user: UserListResponse): void {
    this.dialog
      .open(UserStatusDialog, {
        autoFocus: false,
        data: { user },
        maxWidth: 'calc(100vw - 2rem)',
        width: '32rem',
      })
      .afterClosed()
      .subscribe((action: UserStatusAction | undefined) => {
        if (!action) {
          return;
        }

        this.updateUserStatus(user, action);
      });
  }

  protected deleteUser(user: UserListResponse): void {
    this.dialog.open(AreYouSureDialog, {
      autoFocus: false,
      data: `Da li želiš da obrišeš korisnika ${user.fullName}?`,
    });
  }

  private updateUserStatus(user: UserListResponse, action: UserStatusAction): void {
    const request =
      action === 'verify'
        ? this.usersService.verify(user.id)
        : action === 'block'
          ? this.usersService.block(user.id)
          : this.usersService.unblock(user.id);

    const message =
      action === 'verify'
        ? 'Korisnik je uspešno verifikovan.'
        : action === 'block'
          ? 'Korisnik je uspešno blokiran.'
          : 'Korisnik je uspešno odblokiran.';

    request.pipe(handle(() => this.completeMutation(message), (loading) => this.isLoading.set(loading))).subscribe();
  }

  private loadUsers(): void {
    this.usersService
      .getAll({ page: 1, pageSize: this.pageSize() })
      .pipe(
        handle((response) => {
          this.setTablePage(response.data.items, response.data.page, response.data.pageSize, response.data.totalCount);
          this.mobileUsers.set(response.data.items);
          this.mobilePage.set(response.data.page);
          this.mobileHasNextPage.set(response.data.page < response.data.totalPages);
        }, (loading) => this.isLoading.set(loading)),
      )
      .subscribe();
  }

  private loadTablePage(page: number, pageSize: number): void {
    this.usersService.getAll({ page, pageSize })
      .pipe(handle((response) => this.setTablePage(
        response.data.items,
        response.data.page,
        response.data.pageSize,
        response.data.totalCount,
      ), (loading) => this.isLoading.set(loading)))
      .subscribe();
  }

  private setTablePage(items: UserListResponse[], page: number, pageSize: number, totalCount: number): void {
    this.dataSource.data = items;
    this.currentPage.set(page);
    this.pageSize.set(pageSize);
    this.paginatorLength.set(totalCount);
  }

  private completeMutation(text: string): void {
    this.sharedService.toast.set({ show: true, title: 'Uspeh', text, type: 'success' });
    this.loadUsers();
  }

}
