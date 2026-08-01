import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Button } from '../../../_components/button/button';
import { ButtonIcon } from '../../../_components/button-icon/button-icon';
import { Icon } from '../../../_components/icon/icon';
import { ReservationStatusLabels } from '../../../_shared/constants';
import { handle } from '../../../_shared/http-handler';
import { getDayOfWeek } from '../../../_shared/methods';
import { ReservationResponse, ReservationStatus, TrainingReservationsDialogData } from '../../../_shared/types';
import { ReservationsService } from '../../../_services/reservations.service';

@Component({
  selector: 'app-training-reservations-dialog',
  imports: [Button, ButtonIcon, CdkDrag, CdkDragHandle, DatePipe, Icon, MatTableModule],
  templateUrl: './training-reservations-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingReservationsDialog implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<TrainingReservationsDialog>);
  private readonly data = inject<TrainingReservationsDialogData>(MAT_DIALOG_DATA);
  private readonly reservationsService = inject(ReservationsService);

  protected readonly displayedColumns = ['user', 'email', 'status', 'reservedAt'];
  protected readonly dataSource = new MatTableDataSource<ReservationResponse>([]);
  protected readonly isLoading = signal(false);
  protected readonly reservationStatusLabels = ReservationStatusLabels;
  protected readonly training = this.data.training;
  protected readonly getDayOfWeek = getDayOfWeek;

  ngOnInit(): void {
    this.loadReservations();
  }

  protected close(): void {
    this.dialogRef.close();
  }

  protected getStatusLabel(status: ReservationStatus): string {
    return this.reservationStatusLabels[status];
  }

  private loadReservations(): void {
    this.reservationsService
      .getAll({ page: 1, pageSize: 500, trainingSessionId: this.training.id })
      .pipe(handle((response) => (this.dataSource.data = response.data.items), (loading) => this.isLoading.set(loading)))
      .subscribe();
  }
}
