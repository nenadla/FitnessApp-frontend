import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { email, form, required } from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Button } from '../../_components/button/button';
import { TextInputComponent } from '../../_form-inputs/text-input/text-input';
import { Pages, Titles } from '../../_shared/constants';
import { handle } from '../../_shared/http-handler';
import { ForgotPasswordFormModel } from '../../_shared/types';
import { AuthService } from '../../_services/auth.service';
import { SharedService } from '../../_services/shared.service';

@Component({
  selector: 'app-forgot-password',
  imports: [Button, MatCardModule, RouterLink, TextInputComponent],
  templateUrl: './forgot-password.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly sharedService = inject(SharedService);

  protected readonly isSubmitting = signal(false);
  protected readonly successMessage = signal('');
  protected readonly model = signal<ForgotPasswordFormModel>({ email: '' });
  protected readonly form = form(this.model, (path) => {
    required(path.email, { message: 'Email je obavezan.' });
    email(path.email, { message: 'Unesi ispravnu email adresu.' });
  });

  ngOnInit(): void {
    this.sharedService.setTitle(Titles.ForgotPassword);
    this.sharedService.page.set(Pages.ForgotPassword);
  }

  protected submit(event: SubmitEvent): void {
    event.preventDefault();

    if (!this.form().valid()) {
      this.form().markAsTouched();
      return;
    }

    this.authService
      .forgotPassword(this.model())
      .pipe(
        handle(
          () => {
            this.successMessage.set('Ako nalog postoji, poslat je link za resetovanje lozinke.');
          },
          (loading) => this.isSubmitting.set(loading),
        ),
      )
      .subscribe();
  }
}
