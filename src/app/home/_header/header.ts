import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from '../../_components/icon/icon';
import { ClickOutsideDirective } from '../../_shared/directives/click-outside.directive';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-header',
  imports: [ClickOutsideDirective, Icon],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly mobileMenuToggle = output<void>();
  protected readonly isMenuOpen = signal(false);
  protected readonly initials = computed(() => {
    const user = this.authService.currentUser();

    return `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();
  });

  protected toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  protected openMobileMenu(): void {
    this.mobileMenuToggle.emit();
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected logout(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen.set(false);

    const logoutRequest = this.authService.logout();

    if (!logoutRequest) {
      this.finishLogout();
      return;
    }

    logoutRequest.subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout(): void {
    this.authService.clearSession();
    this.router.navigateByUrl('/');
  }
}
