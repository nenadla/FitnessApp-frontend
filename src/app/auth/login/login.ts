import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, form, required } from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Button } from '../../_components/button/button';
import { TextInputComponent } from '../../_form-inputs/text-input/text-input';
import { handle } from '../../_shared/http-handler';
import { LoginFormModel } from '../../_shared/types';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-login',
  imports: [Button, MatCardModule, TextInputComponent],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly model = signal<LoginFormModel>({ email: '', password: '' });
  protected readonly form = form(this.model, (path) => {
    required(path.email, { message: 'Email je obavezan.' });
    email(path.email, { message: 'Unesi ispravnu email adresu.' });
    required(path.password, { message: 'Lozinka je obavezna.' });
  });

  protected submit(event: SubmitEvent): void {
    event.preventDefault();

    if (!this.form().valid()) {
      this.form().markAsTouched();
      return;
    }

    this.authService
      .login(this.model())
      .pipe(handle(() => this.router.navigateByUrl('/home'), (loading) => this.isSubmitting.set(loading)))
      .subscribe();
  }
}
