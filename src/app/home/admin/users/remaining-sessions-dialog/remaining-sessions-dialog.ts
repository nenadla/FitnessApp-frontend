import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { disabled, form, min, required, validate } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Button } from '../../../../_components/button/button';
import { ButtonIcon } from '../../../../_components/button-icon/button-icon';
import { Icon } from '../../../../_components/icon/icon';
import { TextInputComponent } from '../../../../_form-inputs/text-input/text-input';
import { BalancesService } from '../../../../_services/balances.service';
import { handle } from '../../../../_shared/http-handler';
import { RemainingSessionsDialogData, RemainingSessionsDialogResult } from '../../../../_shared/types';

@Component({
  selector: 'app-remaining-sessions-dialog',
  imports: [Button, ButtonIcon, Icon, TextInputComponent],
  templateUrl: './remaining-sessions-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemainingSessionsDialog {
  private readonly dialogRef = inject(MatDialogRef<RemainingSessionsDialog, RemainingSessionsDialogResult>);
  private readonly balancesService = inject(BalancesService);
  protected readonly data = inject<RemainingSessionsDialogData>(MAT_DIALOG_DATA);

  protected readonly isSaving = signal(false);
  protected readonly model = signal<{ remainingSessions: number | null }>({ remainingSessions: this.data.remainingSessions });
  protected readonly sessionsForm = form(this.model, (path) => {
    required(path.remainingSessions, { message: 'Unesite broj preostalih treninga.' });
    min(path.remainingSessions, 0, { message: 'Broj treninga ne može biti negativan.' });
    validate(path.remainingSessions, ({ value }) => {
      const sessions = value();
      return sessions === null || Number.isSafeInteger(sessions)
        ? undefined
        : { kind: 'integer', message: 'Unesite ceo broj treninga.' };
    });
    disabled(path.remainingSessions, () => this.isSaving());
  });

  protected close(): void {
    if (!this.isSaving()) this.dialogRef.close();
  }

  protected submit(event: SubmitEvent): void {
    event.preventDefault();
    if (this.isSaving()) return;

    this.sessionsForm.remainingSessions().markAsTouched();
    const remainingSessions = this.model().remainingSessions;
    if (!this.sessionsForm().valid() || remainingSessions === null) return;

    this.balancesService.update(this.data.balanceId, { remainingSessions })
      .pipe(handle((response) => {
        this.dialogRef.close({ saved: true, message: response.message });
      }, (loading) => {
        this.isSaving.set(loading);
        this.dialogRef.disableClose = loading;
      }))
      .subscribe();
  }
}
