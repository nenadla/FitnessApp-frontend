import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { form, required } from '@angular/forms/signals';
import { MatDialogRef } from '@angular/material/dialog';
import { Button } from '../../../_components/button/button';
import { ButtonIcon } from '../../../_components/button-icon/button-icon';
import { Icon } from '../../../_components/icon/icon';
import { DateInput } from '../../../_form-inputs/date-input/date-input';
import { TextareaInput } from '../../../_form-inputs/textarea-input/textarea-input';
import { TextInputComponent } from '../../../_form-inputs/text-input/text-input';
import { TimeInput } from '../../../_form-inputs/time-input/time-input';
import { CreateTrainingSessionFormModel, CreateTrainingSessionRequest } from '../../../_shared/types';

@Component({
  selector: 'app-add-training-dialog',
  imports: [Button, ButtonIcon, CdkDrag, CdkDragHandle, DateInput, Icon, TextareaInput, TextInputComponent, TimeInput],
  templateUrl: './add-training-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTrainingDialog {
  private readonly dialogRef = inject(MatDialogRef<AddTrainingDialog, CreateTrainingSessionRequest | false>);

  protected readonly model = signal<CreateTrainingSessionFormModel>({
    title: 'Full Body Fitness',
    description: null,
    date: null,
    startTime: '',
    endTime: '',
    capacity: 15,
    trainerName: 'Sara',
    location: 'Retro Fitness Studio',
  });

  protected readonly form = form(this.model, (path) => {
    required(path.title, { message: 'Naziv treninga je obavezan.' });
    required(path.date, { message: 'Datum treninga je obavezan.' });
    required(path.startTime, { message: 'Početak treninga je obavezan.' });
    required(path.endTime, { message: 'Kraj treninga je obavezan.' });
    required(path.capacity, { message: 'Kapacitet je obavezan.' });
  });

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
    const request: CreateTrainingSessionRequest = {
      title: value.title,
      description: value.description?.trim() || null,
      trainerName: value.trainerName?.trim() || null,
      location: value.location?.trim() || null,
      capacity: value.capacity,
      startTime: this.toIsoDateTime(value.date!, value.startTime),
      endTime: this.toIsoDateTime(value.date!, value.endTime),
    };

    this.dialogRef.close(request);
  }

  private toIsoDateTime(date: Date, time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const dateTime = new Date(date);

    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime.toISOString();
  }
}
