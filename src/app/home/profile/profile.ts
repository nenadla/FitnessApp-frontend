import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { form, minLength, required } from '@angular/forms/signals';
import { Button } from '../../_components/button/button';
import { Icon } from '../../_components/icon/icon';
import { TextInputComponent } from '../../_form-inputs/text-input/text-input';
import { Pages, Titles } from '../../_shared/constants';
import { handle } from '../../_shared/http-handler';
import { ChangePasswordFormModel, UpdateProfileFormModel, UserProfileResponse } from '../../_shared/types';
import { AuthService } from '../../_services/auth.service';
import { ProfileService } from '../../_services/profile.service';
import { SharedService } from '../../_services/shared.service';

@Component({
  selector: 'app-profile',
  imports: [Button, Icon, TextInputComponent],
  templateUrl: './profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly sharedService = inject(SharedService);

  protected readonly isLoading = signal(false);
  protected readonly isSavingProfile = signal(false);
  protected readonly isChangingPassword = signal(false);
  protected readonly profile = signal<UserProfileResponse | null>(null);
  protected readonly passwordError = signal('');

  protected readonly profileModel = signal<UpdateProfileFormModel>({ firstName: '', lastName: '', phoneNumber: '' });
  protected readonly profileForm = form(this.profileModel, (path) => {
    required(path.firstName, { message: 'Ime je obavezno.' });
    required(path.lastName, { message: 'Prezime je obavezno.' });
    required(path.phoneNumber, { message: 'Broj telefona je obavezan.' });
  });

  protected readonly passwordModel = signal<ChangePasswordFormModel>({ currentPassword: '', newPassword: '', confirmPassword: '' });
  protected readonly passwordForm = form(this.passwordModel, (path) => {
    required(path.currentPassword, { message: 'Trenutna lozinka je obavezna.' });
    required(path.newPassword, { message: 'Nova lozinka je obavezna.' });
    minLength(path.newPassword, 8, { message: 'Nova lozinka mora imati najmanje 8 karaktera.' });
    required(path.confirmPassword, { message: 'Potvrda lozinke je obavezna.' });
  });

  ngOnInit(): void {
    this.sharedService.setTitle(Titles.Profile);
    this.sharedService.page.set(Pages.Profile);
    this.loadProfile();
  }

  protected saveProfile(event: SubmitEvent): void {
    event.preventDefault();
    if (!this.profileForm().valid()) {
      this.profileForm().markAsTouched();
      return;
    }

    const value = this.profileModel();
    this.profileService.update({ firstName: value.firstName.trim(), lastName: value.lastName.trim(), phoneNumber: value.phoneNumber.trim() })
      .pipe(handle((response) => this.completeProfileUpdate(response.data), (loading) => this.isSavingProfile.set(loading)))
      .subscribe();
  }

  protected changePassword(event: SubmitEvent): void {
    event.preventDefault();
    if (!this.passwordForm().valid()) {
      this.passwordForm().markAsTouched();
      return;
    }

    const value = this.passwordModel();
    if (value.newPassword !== value.confirmPassword) {
      this.passwordError.set('Nova lozinka i potvrda lozinke se ne podudaraju.');
      return;
    }

    this.passwordError.set('');
    this.profileService.changePassword({ currentPassword: value.currentPassword, newPassword: value.newPassword })
      .pipe(handle(() => this.completePasswordChange(), (loading) => this.isChangingPassword.set(loading)))
      .subscribe();
  }

  private loadProfile(): void {
    this.profileService.getMe()
      .pipe(handle((response) => {
        const profile = response.data;
        this.profile.set(profile);
        this.profileModel.set({ firstName: profile.firstName, lastName: profile.lastName, phoneNumber: profile.phoneNumber ?? '' });
      }, (loading) => this.isLoading.set(loading)))
      .subscribe();
  }

  private completeProfileUpdate(profile: UserProfileResponse): void {
    this.profile.set(profile);
    this.profileModel.set({ firstName: profile.firstName, lastName: profile.lastName, phoneNumber: profile.phoneNumber ?? '' });
    this.authService.updateCurrentUser(profile.firstName, profile.lastName);
    this.sharedService.toast.set({ show: true, title: 'Uspeh', text: 'Podaci profila su uspesno sacuvani.', type: 'success' });
  }

  private completePasswordChange(): void {
    this.passwordModel.set({ currentPassword: '', newPassword: '', confirmPassword: '' });
    this.sharedService.toast.set({ show: true, title: 'Uspeh', text: 'Lozinka je uspesno promenjena.', type: 'success' });
  }
}
