import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet, Routes } from '@angular/router';
import { HeaderComponent } from './_header/header';
import { SidebarComponent } from './_sidebar/sidebar';
import { roleGuard } from '../_shared/guards/role.guard';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, RouterOutlet, SidebarComponent],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly isMobileNavigationOpen = signal(false);

  protected toggleMobileNavigation(): void {
    this.isMobileNavigationOpen.update((isOpen) => !isOpen);
  }

  protected closeMobileNavigation(): void {
    this.isMobileNavigationOpen.set(false);
  }
}

export const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { roles: ['Korisnik'] },
        loadComponent: () => import('./dashboard/dashboard').then((component) => component.DashboardComponent),
      },
      {
        path: 'trainings',
        loadComponent: () => import('./trainings/trainings').then((component) => component.TrainingsComponent),
      },
      {
        path: 'notifications',
        loadComponent: () => import('./notifications/notifications').then((component) => component.NotificationsComponent),
      },
      {
        path: 'profile',
        canActivate: [roleGuard],
        data: { roles: ['Korisnik'] },
        loadComponent: () => import('./profile/profile').then((component) => component.ProfileComponent),
      },
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ['Admin'] },
        loadChildren: () => import('./admin/admin').then((admin) => admin.adminRoutes),
      },
    ],
  },
];
