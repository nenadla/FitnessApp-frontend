import { MatDateFormats } from '@angular/material/core';
import { NotificationType, PurchaseType, ReservationStatus, UserStatus } from './types';

export const ApiVersion = '/api/v1/';

export const Pages = {
  Landing: '/',
  Login: '/login',
  Register: '/register',
  Home: '/home',
  Dashboard: '/home/dashboard',
  Trainings: '/home/trainings',
  AdminReservations: '/home/admin/reservations',
  Profile: '/home/profile',
  AdminUsers: '/home/admin/users',
  AdminPayments: '/home/admin/payments',
  Notifications: '/home/notifications',
};

export const Titles = {
  Landing: 'Retro Fitness',
  Login: 'Prijava',
  Register: 'Registracija',
  Home: 'Pocetna',
  Dashboard: 'Dashboard',
  Trainings: 'Treninzi',
  AdminReservations: 'Rezervacije',
  Profile: 'Profil',
  AdminUsers: 'Korisnici',
  AdminPayments: 'Uplate',
  Notifications: 'Notifikacije',
};

export const ReservationStatusLabels: Record<ReservationStatus, string> = {
  [ReservationStatus.Reserved]: 'Rezervisano',
  [ReservationStatus.Cancelled]: 'Otkazano',
  [ReservationStatus.Attended]: 'Prisustvovao',
  [ReservationStatus.NoShow]: 'Nije dosao',
};

export const UserStatusLabels: Record<UserStatus, string> = {
  [UserStatus.Unverified]: 'Neverifikovan',
  [UserStatus.Verified]: 'Verifikovan',
  [UserStatus.Blocked]: 'Blokiran',
};

export const PurchaseTypeLabels: Record<PurchaseType, string> = {
  [PurchaseType.Package12]: 'Paket 12 termina',
  [PurchaseType.Package6]: 'Paket 6 termina',
  [PurchaseType.SingleSessions]: 'Pojedinacni termini',
};

export const NotificationTypeLabels: Record<NotificationType, string> = {
  [NotificationType.General]: 'Opste',
  [NotificationType.TrainingCancelled]: 'Trening otkazan',
  [NotificationType.TrainingUpdated]: 'Trening izmenjen',
  [NotificationType.MembershipExpiring]: 'Clanarina istice',
  [NotificationType.System]: 'Sistemska',
};

export const MY_DATE_FORMAT: MatDateFormats = {
  parse: { dateInput: 'd MMM, yyyy' },
  display: {
    dateInput: 'd MMM, yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'd MMM, yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};
