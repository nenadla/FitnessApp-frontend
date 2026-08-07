import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { minLength, form, required } from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Button } from '../../_components/button/button';
import { TextInputComponent } from '../../_form-inputs/text-input/text-input';
import { Pages, Titles } from '../../_shared/constants';
import { handle } from '../../_shared/http-handler';
import { ResetPasswordFormModel } from '../../_shared/types';
import { AuthService } from '../../_services/auth.service';
import { SharedService } from '../../_services/shared.service';

@Component({
  selector: 'app-reset-password',
  imports: [Button, MatCardModule, RouterLink, TextInputComponent],
  templateUrl: './reset-password.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly sharedService = inject(SharedService);

  protected readonly isSubmitting = signal(false);
  protected readonly successMessage = signal('');
  protected readonly errorMessage = signal('');
  protected readonly email = signal('');
  protected readonly resetToken = signal('');
  protected readonly model = signal<ResetPasswordFormModel>({
    newPassword: '',
    confirmPassword: '',
  });
  protected readonly form = form(this.model, (path) => {
    required(path.newPassword, { message: 'Nova lozinka je obavezna.' });
    minLength(path.newPassword, 8, { message: 'Lozinka mora imati najmanje 8 karaktera.' });
    required(path.confirmPassword, { message: 'Potvrda lozinke je obavezna.' });
  });

  ngOnInit(): void {
    this.sharedService.setTitle(Titles.ResetPassword);
    this.sharedService.page.set(Pages.ResetPassword);

    const email = this.route.snapshot.queryParamMap.get('email');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!email || !token) {
      this.errorMessage.set('Link za resetovanje lozinke nije ispravan ili je istekao.');
      return;
    }

    this.email.set(email);
    this.resetToken.set(token);
  }

  protected submit(event: SubmitEvent): void {
    event.preventDefault();

    if (this.errorMessage() || !this.email() || !this.resetToken()) {
      return;
    }

    if (!this.form().valid()) {
      this.form().markAsTouched();
      return;
    }

    const { newPassword, confirmPassword } = this.model();

    if (newPassword !== confirmPassword) {
      this.errorMessage.set('Lozinke se ne poklapaju.');
      return;
    }

    this.errorMessage.set('');

    this.authService
      .resetPassword({
        email: this.email(),
        resetToken: this.resetToken(),
        newPassword,
        confirmPassword,
      })
      .pipe(
        handle(
          () => {
            this.successMessage.set('Lozinka je uspešno resetovana. Sada možeš da se prijaviš.');
          },
          (loading) => this.isSubmitting.set(loading),
        ),
      )
      .subscribe();
  }
}
