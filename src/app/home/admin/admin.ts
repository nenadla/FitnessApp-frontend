import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./users/users').then((component) => component.AdminUsersComponent),
  },
  {
    path: 'payments',
    loadComponent: () => import('./payments/payments').then((component) => component.AdminPaymentsComponent),
  },
  {
    path: 'reservations',
    loadComponent: () => import('./reservations/reservations').then((component) => component.AdminReservationsComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'users' },
];
