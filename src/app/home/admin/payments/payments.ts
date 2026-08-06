import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Button } from '../../../_components/button/button';
import { AreYouSureDialog } from '../../../_components/are-you-sure-dialog/are-you-sure-dialog';
import { ButtonIcon } from '../../../_components/button-icon/button-icon';
import { Icon } from '../../../_components/icon/icon';
import { MobileDataCard } from '../../../_components/mobile-data-card/mobile-data-card';
import { Pages, PurchaseTypeLabels, Titles } from '../../../_shared/constants';
import { handle } from '../../../_shared/http-handler';
import { PaymentDialogResult, PaymentResponse, PurchaseType } from '../../../_shared/types';
import { SharedService } from '../../../_services/shared.service';
import { PaymentsService } from '../../../_services/payments.service';
import { AddPaymentDialog } from './add-payment-dialog/add-payment-dialog';

@Component({
  selector: 'app-admin-payments',
  imports: [Button, ButtonIcon, DatePipe, DecimalPipe, Icon, MatPaginatorModule, MatSortModule, MatTableModule, MobileDataCard],
  templateUrl: './payments.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPaymentsComponent implements AfterViewInit, OnInit {
  private readonly sharedService = inject(SharedService);
  private readonly paymentsService = inject(PaymentsService);
  private readonly dialog = inject(MatDialog);
  private readonly sort = viewChild.required(MatSort);

  protected readonly displayedColumns = ['user', 'paymentType', 'numberOfSessions', 'amount', 'paymentDate', 'note', 'actions'];
  protected readonly dataSource = new MatTableDataSource<PaymentResponse>([]);
  protected readonly mobilePayments = signal<PaymentResponse[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly isLoadingMore = signal(false);
  protected readonly currentPage = signal(1);
  protected readonly pageSize = signal(20);
  protected readonly paginatorLength = signal(0);
  protected readonly mobilePage = signal(1);
  protected readonly mobileHasNextPage = signal(false);
  protected readonly purchaseTypeLabels = PurchaseTypeLabels;

  ngOnInit(): void {
    this.sharedService.setTitle(Titles.AdminPayments);
    this.sharedService.page.set(Pages.AdminPayments);
    this.loadPayments();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort();
  }

  protected changePage(event: PageEvent): void {
    this.loadTablePage(event.pageIndex + 1, event.pageSize);
  }

  protected loadMoreMobile(): void {
    if (!this.mobileHasNextPage() || this.isLoadingMore()) return;

    this.paymentsService.getAll({ page: this.mobilePage() + 1, pageSize: 20 })
      .pipe(handle((response) => {
        this.mobilePayments.update((payments) => [...payments, ...response.data.items]);
        this.mobilePage.set(response.data.page);
        this.mobileHasNextPage.set(response.data.page < response.data.totalPages);
      }, (loading) => this.isLoadingMore.set(loading)))
      .subscribe();
  }

  protected getPaymentTypeLabel(paymentType: PurchaseType): string {
    return this.purchaseTypeLabels[paymentType];
  }

  protected paymentDetails(payment: PaymentResponse) {
    return [
      { label: 'Broj termina', value: payment.numberOfSessions },
      { label: 'Iznos', value: `${new Intl.NumberFormat('sr-Latn-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(payment.amount)} RSD` },
      { label: 'Napomena', value: payment.note || '-' },
    ];
  }

  protected openAddPaymentDialog(): void {
    this.dialog
      .open(AddPaymentDialog, {
        autoFocus: false,
        data: { mode: 'create' },
        maxWidth: 'calc(100vw - 2rem)',
        width: '44rem',
      })
      .afterClosed()
      .subscribe((result: PaymentDialogResult) => this.handlePaymentDialogResult(result));
  }

  protected openEditPaymentDialog(payment: PaymentResponse): void {
    this.dialog
      .open(AddPaymentDialog, {
        autoFocus: false,
        data: { mode: 'edit', payment },
        maxWidth: 'calc(100vw - 2rem)',
        width: '44rem',
      })
      .afterClosed()
      .subscribe((result: PaymentDialogResult) => this.handlePaymentDialogResult(result));
  }

  protected confirmDeletePayment(payment: PaymentResponse): void {
    this.dialog
      .open(AreYouSureDialog, {
        autoFocus: false,
        data: `Da li želiš da obrišeš uplatu korisnika ${payment.userFullName}? Ova akcija se ne može poništiti.`,
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.paymentsService
          .delete(payment.id)
          .pipe(handle(() => this.completeMutation('Uplata je uspešno obrisana.'), (loading) => this.isLoading.set(loading)))
          .subscribe();
      });
  }

  private loadPayments(): void {
    this.paymentsService
      .getAll({ page: 1, pageSize: this.pageSize() })
      .pipe(handle((response) => {
        this.setTablePage(response.data.items, response.data.page, response.data.pageSize, response.data.totalCount);
        this.mobilePayments.set(response.data.items);
        this.mobilePage.set(response.data.page);
        this.mobileHasNextPage.set(response.data.page < response.data.totalPages);
      }, (loading) => this.isLoading.set(loading)))
      .subscribe();
  }

  private loadTablePage(page: number, pageSize: number): void {
    this.paymentsService.getAll({ page, pageSize })
      .pipe(handle((response) => this.setTablePage(
        response.data.items,
        response.data.page,
        response.data.pageSize,
        response.data.totalCount,
      ), (loading) => this.isLoading.set(loading)))
      .subscribe();
  }

  private setTablePage(items: PaymentResponse[], page: number, pageSize: number, totalCount: number): void {
    this.dataSource.data = items;
    this.currentPage.set(page);
    this.pageSize.set(pageSize);
    this.paginatorLength.set(totalCount);
  }

  private handlePaymentDialogResult(result: PaymentDialogResult): void {
    if (!result) {
      return;
    }

    if (result.mode === 'create') {
      this.paymentsService
        .create(result.request)
        .pipe(handle(() => this.completeMutation(), (loading) => this.isLoading.set(loading)))
        .subscribe();
      return;
    }

    this.paymentsService
      .update(result.id, result.request)
      .pipe(handle(() => this.completeMutation('Uplata je uspešno izmenjena.'), (loading) => this.isLoading.set(loading)))
      .subscribe();
  }

  private completeMutation(text: string = 'Uplata je uspešno evidentirana.'): void {
    this.sharedService.toast.set({ show: true, title: 'Uspeh', text, type: 'success' });
    this.loadPayments();
  }
}
