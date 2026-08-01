import { Injectable, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Pages, Titles } from '../_shared/constants';
import { Organization, Toast, UserProfile } from '../_shared/types';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  titleService = inject(Title);
  router = inject(Router);
  route = inject(ActivatedRoute);

  title = signal(Titles.Landing);
  page = signal(Pages.Landing);
  toast = signal<Toast>({show: false});

  selectedOrg = signal<Organization | undefined>(undefined);
  userOrganizations = signal<Organization[]>([]);
  selectedOrg$ = toObservable(this.selectedOrg);


  userProfile = signal<UserProfile>({id: '', email: '', firstName: '', lastName: '', companyId: '', createdDate: '', acceptTermsOfUse: false, accessRP: false, authUserTermsAndConditions: false, accessIS: false, authUserTermsAndConditionsIS: false, acceptTermsOfUseIS: true, features: { emailNotificationPreferencesEnabled: false, adminReportsEnabled: false }});
 
  scrollEvent = signal<Event | null>(null);

  setTitle(value: string){
    this.title.set(value);
    this.titleService.setTitle(value + ' | Retro Fitness');
  }

  
}
