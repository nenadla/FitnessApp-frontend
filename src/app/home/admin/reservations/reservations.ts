import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Pages, ReservationStatusLabels, Titles } from '../../../_shared/constants';
import { handle } from '../../../_shared/http-handler';
import { ReservationResponse, ReservationStatus } from '../../../_shared/types';
import { ReservationsService } from '../../../_services/reservations.service';
import { SharedService } from '../../../_services/shared.service';

@Component({
  selector: 'app-admin-reservations',
  imports: [DatePipe, MatPaginatorModule, MatSortModule, MatTableModule],
  templateUrl: './reservations.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminReservationsComponent implements AfterViewInit, OnInit {
  private readonly reservationsService = inject(ReservationsService);
  private readonly sharedService = inject(SharedService);
  private readonly paginator = viewChild.required(MatPaginator);
  private readonly sort = viewChild.required(MatSort);

  protected readonly displayedColumns = ['user', 'training', 'date', 'time', 'trainer', 'status', 'reservedAt'];
  protected readonly dataSource = new MatTableDataSource<ReservationResponse>([]);
  protected readonly isLoading = signal(false);
  protected readonly reservationStatusLabels = ReservationStatusLabels;

  ngOnInit(): void {
    this.sharedService.setTitle(Titles.AdminReservations);
    this.sharedService.page.set(Pages.AdminReservations);
    this.loadReservations();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator();
    this.dataSource.sort = this.sort();
  }

  protected getStatusLabel(status: ReservationStatus): string {
    return this.reservationStatusLabels[status];
  }

  private loadReservations(): void {
    this.reservationsService
      .getAll()
      .pipe(handle((response) => (this.dataSource.data = response.data.items), (loading) => this.isLoading.set(loading)))
      .subscribe();
  }
}
