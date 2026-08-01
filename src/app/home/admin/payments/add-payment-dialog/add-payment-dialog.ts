import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { disabled, form, required } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AutocompleteInput } from '../../../../_form-inputs/autocomplete-input/autocomplete-input';
import { SelectInput } from '../../../../_form-inputs/select-input/select-input';
import { TextareaInput } from '../../../../_form-inputs/textarea-input/textarea-input';
import { TextInputComponent } from '../../../../_form-inputs/text-input/text-input';
import { Button } from '../../../../_components/button/button';
import { ButtonIcon } from '../../../../_components/button-icon/button-icon';
import { Icon } from '../../../../_components/icon/icon';
import { DateInput } from '../../../../_form-inputs/date-input/date-input';
import { PurchaseTypeLabels } from '../../../../_shared/constants';
import { handle } from '../../../../_shared/http-handler';
import {
  CreatePaymentFormModel,
  CreatePaymentRequest,
  PaymentDialogData,
  PaymentDialogResult,
  PurchaseType,
  UpdatePaymentRequest,
  UserListResponse,
} from '../../../../_shared/types';
import { UsersService } from '../../../../_services/users.service';

@Component({
  selector: 'app-add-payment-dialog',
  imports: [
    AutocompleteInput,
    Button,
    ButtonIcon,
    CdkDrag,
    CdkDragHandle,
    DateInput,
    Icon,
    SelectInput,
    TextareaInput,
    TextInputComponent,
  ],
  templateUrl: './add-payment-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPaymentDialog implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<AddPaymentDialog, PaymentDialogResult>);
  private readonly usersService = inject(UsersService);
  private readonly data = inject<PaymentDialogData>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data.mode === 'edit';
  protected readonly PurchaseType = PurchaseType;
  protected readonly purchaseTypeLabels = PurchaseTypeLabels;
  protected readonly purchaseTypes = [PurchaseType.Package12, PurchaseType.Package6, PurchaseType.SingleSessions];
  protected readonly users = signal<UserListResponse[]>([]);
  protected readonly isUsersLoading = signal(false);
  protected readonly userLabels = computed(() => this.users().map((user) => this.userLabel(user)));
  protected readonly model = signal<CreatePaymentFormModel>({
    userId: '',
    userSearch: '',
    amount: 0,
    paymentType: PurchaseType.Package12,
    numberOfSessions: 12,
    note: null,
    startDate: new Date(),
  });
  protected readonly paymentForm = form(this.model, (path) => {
    required(path.userId, { message: 'Korisnik je obavezan.' });
    required(path.amount, { message: 'Iznos je obavezan.' });
    required(path.paymentType, { message: 'Tip uplate je obavezan.' });
    required(path.numberOfSessions, { message: 'Broj termina je obavezan.' });
    if (!this.isEdit) {
      required(path.startDate, { message: 'Start date je obavezan.' });
    }
    disabled(path.userSearch, () => this.isEdit);
    disabled(path.paymentType, () => this.isEdit);
    disabled(path.numberOfSessions, ({ valueOf }) => this.isEdit || valueOf(path.paymentType) !== PurchaseType.SingleSessions);
  });

  ngOnInit(): void {
    if (this.isEdit) {
      const payment = this.data.payment!;
      this.model.set({
        userId: payment.userId,
        userSearch: payment.userFullName,
        amount: payment.amount,
        paymentType: payment.paymentType,
        numberOfSessions: payment.numberOfSessions,
        note: payment.note || null,
        startDate: null,
      });
      return;
    }

    this.loadUsers();
  }

  protected selectUser(label: string): void {
    const user = this.users().find((item) => this.userLabel(item) === label);
    this.model.update((value) => ({ ...value, userId: user?.id ?? '' }));
  }

  protected changePaymentType(paymentType: PurchaseType): void {
    const numberOfSessions =
      paymentType === PurchaseType.Package12 ? 12 : paymentType === PurchaseType.Package6 ? 6 : 1;

    this.model.update((value) => ({ ...value, paymentType, numberOfSessions }));
  }

  protected close(): void {
    this.dialogRef.close(false);
  }

  protected submit(event: SubmitEvent): void {
    event.preventDefault();

    if (!this.paymentForm().valid()) {
      this.paymentForm().markAsTouched();
      return;
    }

    const value = this.model();
    const paymentDate = this.isEdit ? this.data.payment!.paymentDate : new Date().toISOString();

    if (this.isEdit) {
      const request: UpdatePaymentRequest = {
        amount: Number(value.amount),
        paymentDate,
        note: value.note?.trim() || null,
      };

      this.dialogRef.close({ mode: 'edit', id: this.data.payment!.id, request });
      return;
    }

    const request: CreatePaymentRequest = {
      userId: value.userId,
      amount: Number(value.amount),
      paymentDate,
      paymentType: value.paymentType,
      numberOfSessions: Number(value.numberOfSessions),
      note: value.note?.trim() || null,
      startDate: value.startDate!.toISOString(),
    };

    this.dialogRef.close({ mode: 'create', request });
  }

  private loadUsers(): void {
    this.usersService
      .getAll()
      .pipe(handle((response) => this.users.set(response.data.items), (loading) => this.isUsersLoading.set(loading)))
      .subscribe();
  }

  private userLabel(user: UserListResponse): string {
    return `${user.fullName} (${user.email})`;
  }
}
