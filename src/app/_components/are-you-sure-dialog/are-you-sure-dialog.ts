
import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Button } from '../button/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-are-you-sure-dialog',
  imports: [Button, CdkDrag, CdkDragHandle],
  templateUrl: './are-you-sure-dialog.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreYouSureDialog {
  dialogRef = inject(MatDialogRef<AreYouSureDialog, boolean>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: string | undefined) {}
}
