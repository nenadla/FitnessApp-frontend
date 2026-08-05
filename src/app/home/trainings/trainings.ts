import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { form } from '@angular/forms/signals';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Button } from '../../_components/button/button';
import { ButtonIcon } from '../../_components/button-icon/button-icon';
import { MobileDataCard } from '../../_components/mobile-data-card/mobile-data-card';
import { AreYouSureDialog } from '../../_components/are-you-sure-dialog/are-you-sure-dialog';
import { Icon } from '../../_components/icon/icon';
import { TextInputComponent } from '../../_form-inputs/text-input/text-input';
import { handle } from '../../_shared/http-handler';
import { formatDateToStringWithDots, getDayOfWeek } from '../../_shared/methods';
import { TrainingCalendarResponse, TrainingDialogData, TrainingDialogResult, TrainingSearchFormModel } from '../../_shared/types';
import { TrainingsService } from '../../_services/trainings.service';
import { ReservationsService } from '../../_services/reservations.service';
import { SharedService } from '../../_services/shared.service';
import { AuthService } from '../../_services/auth.service';
import { Pages, Titles } from '../../_shared/constants';
import { AddTrainingDialog } from './add-training-dialog/add-training-dialog';
import { TrainingReservationsDialog } from './training-reservations-dialog/training-reservations-dialog';
import { TrainingCard } from './training-card/training-card';

@Component({
  selector: 'app-trainings',
  imports: [
    Button,
    ButtonIcon,
    DatePipe,
    Icon,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MobileDataCard,
    TextInputComponent,
    TrainingCard,
  ],
  templateUrl: './trainings.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingsComponent implements AfterViewInit, OnInit {
  private readonly trainingsService = inject(TrainingsService);
  private readonly reservationsService = inject(ReservationsService);
  private readonly sharedService = inject(SharedService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly paginator = viewChild(MatPaginator);
  private readonly sort = viewChild(MatSort);

  protected readonly displayedColumns = [
    'date',
    'time',
    'title',
    'trainerName',
    'capacity',
    'reservedCount',
    'status',
    'actions',
  ];
  protected readonly dataSource = new MatTableDataSource<TrainingCalendarResponse>([]);
  protected readonly trainings = signal<TrainingCalendarResponse[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly reservationSubmittingId = signal<string | null>(null);
  protected readonly isAdmin = computed(() => this.authService.currentUser()?.role === 'Admin');
  protected readonly getDayOfWeek = getDayOfWeek;
  protected readonly searchModel = signal<TrainingSearchFormModel>({ search: '' });
  protected readonly searchForm = form(this.searchModel);
  protected readonly searchTerm = signal('');
  protected readonly activeOnly = signal(true);
  protected readonly filteredTrainings = computed(() => {
    const filter = this.searchTerm();

    if (!filter) {
      return this.trainings();
    }

    return this.trainings().filter((training) => this.matchesSearch(training, filter));
  });

  constructor() {
    this.dataSource.filterPredicate = (training, filter) => {
      const searchableValue = this.getSearchableTrainingText(training);
      return searchableValue.includes(filter);
    };
  }

  ngOnInit(): void {
    this.sharedService.setTitle(Titles.Trainings);
    this.sharedService.page.set(Pages.Trainings);
    this.loadTrainings();
  }

  ngAfterViewInit(): void {
    const paginator = this.paginator();
    const sort = this.sort();

    if (paginator) {
      this.dataSource.paginator = paginator;
    }

    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  protected applySearch(value: string): void {
    const filter = value.trim().toLowerCase();
    this.searchTerm.set(filter);
    this.dataSource.filter = filter;
    this.dataSource.paginator?.firstPage();
  }

  protected changeActiveOnly(checked: boolean): void {
    this.activeOnly.set(checked);
    this.loadTrainings();
  }

  protected openAddTrainingDialog(): void {
    this.openTrainingDialog({ mode: 'create' });
  }

  protected openEditTrainingDialog(training: TrainingCalendarResponse): void {
    this.trainingsService
      .getById(training.id)
      .pipe(handle((response) => this.openTrainingDialog({ mode: 'edit', training: response.data }), (loading) => this.isLoading.set(loading)))
      .subscribe();
  }

  protected openTrainingReservationsDialog(training: TrainingCalendarResponse): void {
    this.dialog.open(TrainingReservationsDialog, {
      autoFocus: false,
      data: { training },
      maxWidth: 'calc(100vw - 2rem)',
      width: '50rem',
    });
  }

  protected confirmReservation(training: TrainingCalendarResponse): void {
    if (!this.canReserveTraining(training)) {
      return;
    }

    this.dialog
      .open(AreYouSureDialog, {
        autoFocus: false,
        data: `Da li zelis da se prijavis na trening ${training.title}, ${this.getTrainingDateLabel(training)}?`,
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.reservationsService
          .create({ trainingSessionId: training.id })
          .pipe(handle(() => this.completeReservation(), (loading) => this.setReservationSubmitting(training.id, loading)))
          .subscribe();
      });
  }

  protected canReserveTraining(training: TrainingCalendarResponse): boolean {
    return !training.isCancelled && training.reservedCount < training.capacity;
  }

  protected reservationTooltip(training: TrainingCalendarResponse): string {
    if (training.isCancelled) {
      return 'Trening je otkazan';
    }

    return this.canReserveTraining(training) ? 'Prijavi se na trening' : 'Nema slobodnih mesta';
  }

  protected trainingDetails(training: TrainingCalendarResponse) {
    return [
      { label: 'Vreme', value: `${this.formatTime(training.startTime)} - ${this.formatTime(training.endTime)}` },
      { label: 'Trener', value: training.trainerName || '-' },
      { label: 'Kapacitet', value: `${training.reservedCount}/${training.capacity}` },
    ];
  }

  protected confirmDeleteTraining(training: TrainingCalendarResponse): void {
    this.dialog
      .open(AreYouSureDialog, {
        autoFocus: false,
        data: 'Da li zelis da obrises ovaj trening? Ova akcija se ne moze ponistiti.',
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.trainingsService
          .delete(training.id)
          .pipe(handle(() => this.completeMutation('Trening je uspesno obrisan.'), (loading) => this.isLoading.set(loading)))
          .subscribe();
      });
  }

  private openTrainingDialog(data: TrainingDialogData): void {
    this.dialog
      .open(AddTrainingDialog, {
        autoFocus: false,
        data,
        maxWidth: 'calc(100vw - 2rem)',
        width: '44rem',
      })
      .afterClosed()
      .subscribe((result: TrainingDialogResult) => {
        if (!result) {
          return;
        }

        if (result.mode === 'create') {
          this.trainingsService
            .create(result.request)
            .pipe(handle(() => this.completeMutation('Trening je uspesno dodat.'), (loading) => this.isLoading.set(loading)))
            .subscribe();
          return;
        }

        this.trainingsService
          .update(result.id, result.request)
          .pipe(handle(() => this.completeMutation('Izmene treninga su uspesno sacuvane.'), (loading) => this.isLoading.set(loading)))
          .subscribe();
      });
  }

  private loadTrainings(): void {
    this.trainingsService
      .getAll({ activeOnly: this.isAdmin() ? this.activeOnly() : true })
      .pipe(handle((response) => {
        this.trainings.set(response.data);
        this.dataSource.data = response.data;
      }, (loading) => this.isLoading.set(loading)))
      .subscribe();
  }

  private completeMutation(text: string): void {
    this.sharedService.toast.set({ show: true, title: 'Uspeh', text, type: 'success' });
    this.loadTrainings();
  }

  private completeReservation(): void {
    this.sharedService.toast.set({ show: true, title: 'Uspeh', text: 'Uspesno si prijavljen na trening.', type: 'success' });
    this.loadTrainings();
  }

  private getTrainingDateLabel(training: TrainingCalendarResponse): string {
    return `${getDayOfWeek(training.startTime)} ${formatDateToStringWithDots(new Date(training.startTime))}.`;
  }

  private formatTime(value: string): string {
    return new Intl.DateTimeFormat('sr-Latn-RS', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(value));
  }

  private matchesSearch(training: TrainingCalendarResponse, filter: string): boolean {
    return this.getSearchableTrainingText(training).includes(filter);
  }

  private getSearchableTrainingText(training: TrainingCalendarResponse): string {
    const startDate = new Date(training.startTime);
    const isoDate = startDate.toISOString().slice(0, 10);
    const localizedDate = formatDateToStringWithDots(startDate);
    const dayOfWeek = getDayOfWeek(training.startTime);

    return `${training.title} ${training.trainerName} ${training.location} ${dayOfWeek} ${isoDate} ${localizedDate}`.toLowerCase();
  }

  private setReservationSubmitting(trainingId: string, isSubmitting: boolean): void {
    this.reservationSubmittingId.set(isSubmitting ? trainingId : null);
  }
}
