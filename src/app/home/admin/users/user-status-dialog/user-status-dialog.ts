import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Button } from '../../../../_components/button/button';
import { ButtonIcon } from '../../../../_components/button-icon/button-icon';
import { Icon } from '../../../../_components/icon/icon';
import { UserStatus, UserStatusAction, UserStatusDialogData } from '../../../../_shared/types';

@Component({
  selector: 'app-user-status-dialog',
  imports: [Button, ButtonIcon, CdkDrag, CdkDragHandle, Icon],
  templateUrl: './user-status-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserStatusDialog {
  protected readonly data = inject<UserStatusDialogData>(MAT_DIALOG_DATA);
  protected readonly UserStatus = UserStatus;
  protected readonly dialogRef = inject(MatDialogRef<UserStatusDialog, UserStatusAction | undefined>);

  protected selectAction(action: UserStatusAction): void {
    this.dialogRef.close(action);
  }

  protected close(): void {
    this.dialogRef.close();
  }
}
