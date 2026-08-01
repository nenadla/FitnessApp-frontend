import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { form, required } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Button } from '../../../_components/button/button';
import { ButtonIcon } from '../../../_components/button-icon/button-icon';
import { Icon } from '../../../_components/icon/icon';
import { DateInput } from '../../../_form-inputs/date-input/date-input';
import { TextareaInput } from '../../../_form-inputs/textarea-input/textarea-input';
import { TextInputComponent } from '../../../_form-inputs/text-input/text-input';
import { TimeInput } from '../../../_form-inputs/time-input/time-input';
import {
  CreateTrainingSessionFormModel,
  CreateTrainingSessionRequest,
  TrainingDialogData,
  TrainingDialogResult,
  UpdateTrainingSessionRequest,
} from '../../../_shared/types';

@Component({
  selector: 'app-add-training-dialog',
  imports: [Button, ButtonIcon, CdkDrag, CdkDragHandle, DateInput, Icon, TextareaInput, TextInputComponent, TimeInput],
  templateUrl: './add-training-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTrainingDialog implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<AddTrainingDialog, TrainingDialogResult>);
  private readonly data = inject<TrainingDialogData>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data.mode === 'edit';

  protected readonly model = signal<CreateTrainingSessionFormModel>({
    title: 'Full Body Fitness',
    description: null,
    date: null,
    startTime: '',
    endTime: '',
    capacity: 10,
    trainerName: 'Sara',
    location: 'Retro Fitness Studio',
  });
  protected readonly form = form(this.model, (path) => {
    required(path.title, { message: 'Naziv treninga je obavezan.' });
    required(path.date, { message: 'Datum treninga je obavezan.' });
    required(path.startTime, { message: 'Pocetak treninga je obavezan.' });
    required(path.endTime, { message: 'Kraj treninga je obavezan.' });
    required(path.capacity, { message: 'Kapacitet je obavezan.' });
  });

  ngOnInit(): void {
    if (!this.data.training) {
      return;
    }

    const training = this.data.training;
    const startTime = new Date(training.startTime);
    const endTime = new Date(training.endTime);

    this.model.set({
      title: training.title,
      description: training.description || null,
      date: startTime,
      startTime: this.toTimeValue(startTime),
      endTime: this.toTimeValue(endTime),
      capacity: training.capacity,
      trainerName: training.trainerName || null,
      location: training.location || null,
    });
  }

  protected close(): void {
    this.dialogRef.close(false);
  }

  protected submit(event: SubmitEvent): void {
    event.preventDefault();

    if (!this.form().valid()) {
      this.form().markAsTouched();
      return;
    }

    const value = this.model();
    const baseRequest: CreateTrainingSessionRequest = {
      title: value.title,
      description: value.description?.trim() || null,
      trainerName: value.trainerName?.trim() || null,
      location: value.location?.trim() || null,
      capacity: value.capacity,
      startTime: this.toIsoDateTime(value.date!, value.startTime),
      endTime: this.toIsoDateTime(value.date!, value.endTime),
    };

    if (!this.isEdit) {
      this.dialogRef.close({ mode: 'create', request: baseRequest });
      return;
    }

    const updateRequest: UpdateTrainingSessionRequest = {
      title: baseRequest.title,
      description: baseRequest.description,
      startTime: baseRequest.startTime,
      endTime: baseRequest.endTime,
      capacity: baseRequest.capacity,
      isCancelled: this.data.training?.isCancelled ?? false,
      cancellationReason: this.data.training?.cancellationReason ?? null,
    };

    this.dialogRef.close({ mode: 'edit', id: this.data.training!.id, request: updateRequest });
  }

  private toIsoDateTime(date: Date, time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const dateTime = new Date(date);

    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime.toISOString();
  }

  private toTimeValue(date: Date): string {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}
