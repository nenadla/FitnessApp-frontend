import { ChangeDetectionStrategy, Component, inject, Inject, signal, type OnInit } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Toast } from '../../_shared/types';
import { ButtonIcon } from "../button-icon/button-icon";
import { Icon } from "../icon/icon";

@Component({
  selector: 'app-toast-dialog',
  imports: [ButtonIcon, Icon],
  templateUrl: './toast-dialog.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastDialog implements OnInit {
  dialogRef = inject(MatDialogRef<ToastDialog>);
  private timeout: number | null = null;

  toast = signal<Toast | undefined>(undefined);
  constructor(@Inject(DIALOG_DATA) public data: Toast) {
    this.toast.set(data);
  }

  ngOnInit(): void {
    if(this.toast()?.show){
      this.timeout = window.setTimeout(() => {
        this.dialogRef.close();
      }, 3500);
    }
  }

  hide(){
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this.timeout = null;
      this.dialogRef.close();
    }
  }
}
