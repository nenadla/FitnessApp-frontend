import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, form, minLength, required } from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { Button } from '../../_components/button/button';
import { DateInput } from '../../_form-inputs/date-input/date-input';
import { handle } from '../../_shared/http-handler';
import { RegisterFormModel } from '../../_shared/types';
import { TextInputComponent } from '../../_form-inputs/text-input/text-input';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-register',
  imports: [Button, DateInput, MatCardModule, TextInputComponent],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  private readonly model = signal<RegisterFormModel>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: null,
    password: '',
    confirmPassword: '',
  });

  protected readonly form = form(this.model, (path) => {
    required(path.firstName, { message: 'Ime je obavezno.' });
    required(path.lastName, { message: 'Prezime je obavezno.' });
    required(path.email, { message: 'Email je obavezan.' });
    email(path.email, { message: 'Unesi ispravnu email adresu.' });
    required(path.phoneNumber, { message: 'Broj telefona je obavezan.' });
    required(path.password, { message: 'Lozinka je obavezna.' });
    // minLength(path.password, 8, { message: 'Lozinka mora imati najmanje 8 karaktera.' });
    required(path.confirmPassword, { message: 'Potvrda lozinke je obavezna.' });
  });

  protected submit(event: SubmitEvent): void {
    event.preventDefault();

    if (!this.form().valid()) {
      this.form().markAsTouched();
      return;
    }

    const { confirmPassword, dateOfBirth, ...request } = this.model();

    if (request.password !== confirmPassword) {
      this.errorMessage.set('Lozinke se ne podudaraju.');
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    this.authService
      .register({ ...request, dateOfBirth: dateOfBirth?.toISOString().slice(0, 10) ?? null })
      .pipe(
        handle(
          () => {
            this.successMessage.set('Registracija je uspesna. Sacekaj verifikaciju naloga od administratora.');
          },
          (loading) => this.isSubmitting.set(loading),
        ),
      )
      .subscribe();
  }
}
