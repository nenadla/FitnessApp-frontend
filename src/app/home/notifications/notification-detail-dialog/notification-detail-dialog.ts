import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Button } from '../../../_components/button/button';
import { ButtonIcon } from '../../../_components/button-icon/button-icon';
import { Icon } from '../../../_components/icon/icon';
import { NotificationTypeLabels } from '../../../_shared/constants';
import { NotificationDetailDialogData } from '../../../_shared/types';

@Component({
  selector: 'app-notification-detail-dialog',
  imports: [Button, ButtonIcon, CdkDrag, CdkDragHandle, DatePipe, Icon],
  templateUrl: './notification-detail-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationDetailDialog {
  protected readonly dialogRef = inject(MatDialogRef<NotificationDetailDialog>);
  protected readonly data = inject<NotificationDetailDialogData>(MAT_DIALOG_DATA);
  protected readonly typeLabels = NotificationTypeLabels;
}
