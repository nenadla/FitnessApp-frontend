import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Button } from '../button/button';
import { ButtonIcon } from '../button-icon/button-icon';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-important-info-dialog',
  imports: [Button, ButtonIcon, Icon],
  templateUrl: './important-info-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportantInfoDialog {
  protected readonly dialogRef = inject(MatDialogRef<ImportantInfoDialog>);
}
