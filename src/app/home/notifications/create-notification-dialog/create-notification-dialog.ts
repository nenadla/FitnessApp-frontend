import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { form, required } from '@angular/forms/signals';
import { MatDialogRef } from '@angular/material/dialog';
import { Button } from '../../../_components/button/button';
import { ButtonIcon } from '../../../_components/button-icon/button-icon';
import { Icon } from '../../../_components/icon/icon';
import { SelectInput } from '../../../_form-inputs/select-input/select-input';
import { TextInputComponent } from '../../../_form-inputs/text-input/text-input';
import { TextareaInput } from '../../../_form-inputs/textarea-input/textarea-input';
import { NotificationTypeLabels } from '../../../_shared/constants';
import { CreateNotificationFormModel, CreateNotificationRequest, NotificationType } from '../../../_shared/types';

@Component({
  selector: 'app-create-notification-dialog',
  imports: [Button, ButtonIcon, CdkDrag, CdkDragHandle, Icon, SelectInput, TextInputComponent, TextareaInput],
  templateUrl: './create-notification-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNotificationDialog {
  private readonly dialogRef = inject(MatDialogRef<CreateNotificationDialog, CreateNotificationRequest | false>);

  protected readonly notificationTypes = Object.values(NotificationType).filter((value): value is NotificationType => typeof value === 'number');
  protected readonly notificationTypeLabels = NotificationTypeLabels;
  protected readonly notificationTypeOptions = this.notificationTypes.map((type) => this.notificationTypeLabels[type]);
  protected readonly emailOptions = ['Ne', 'Da'];
  protected readonly emailValues = [false, true];
  protected readonly model = signal<CreateNotificationFormModel>({ title: '', message: '', type: NotificationType.General, sendEmail: false });
  protected readonly form = form(this.model, (path) => {
    required(path.title, { message: 'Naslov je obavezan.' });
    required(path.message, { message: 'Poruka je obavezna.' });
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
    this.dialogRef.close({ title: value.title.trim(), message: value.message.trim(), type: value.type, sendEmail: value.sendEmail });
  }
}
