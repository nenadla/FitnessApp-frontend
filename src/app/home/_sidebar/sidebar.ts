import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonIcon } from '../../_components/button-icon/button-icon';
import { Icon } from '../../_components/icon/icon';
import { NavigationItem } from '../../_shared/types';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [ButtonIcon, Icon, MatTooltipModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  protected readonly authService = inject(AuthService);
  readonly mobileOpen = input(false);
  readonly mobileClose = output<void>();
  protected readonly isExpanded = signal(false);
  protected readonly isNavigationExpanded = computed(() => this.isExpanded() || this.mobileOpen());

  private readonly navigationItems: NavigationItem[] = [
    { label: 'Dashboard', link: '/home/dashboard', icon: 'home', roles: ['Korisnik'] },
    { label: 'Korisnici', link: '/home/admin/users', icon: 'users', roles: ['Admin'] },
    { label: 'Treninzi', link: '/home/trainings', icon: 'calendar' },
    { label: 'Članarina', link: '/home/memberships', icon: 'dollar', roles: ['Korisnik'] },
    { label: 'Rezervacije', link: '/home/admin/reservations', icon: 'groups', roles: ['Admin'] },
    { label: 'Profil', link: '/home/profile', icon: 'user', roles: ['Korisnik'] },
    { label: 'Uplate', link: '/home/admin/payments', icon: 'dollar', roles: ['Admin'] },
    { label: 'Notifikacije', link: '/home/notifications', icon: 'email' },
  ];

  protected readonly visibleItems = computed(() => {
    const role = this.authService.currentUser()?.role;

    return this.navigationItems.filter((item) => !item.roles || (!!role && item.roles.includes(role)));
  });

  protected closeMobileNavigation(): void {
    this.mobileClose.emit();
  }
}
