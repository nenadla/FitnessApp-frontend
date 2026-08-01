import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { UserRole } from '../types';

function hasRequiredRole(roles: UserRole[] | undefined): boolean {
  const authService = inject(AuthService);

  return !!roles?.includes(authService.currentUser()?.role as UserRole);
}

function roleResult(roles: UserRole[] | undefined) {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (hasRequiredRole(roles)) {
    return true;
  }

  const fallbackPath = authService.currentUser()?.role === 'Admin' ? '/home/admin/users' : '/home/dashboard';
  return router.createUrlTree([fallbackPath]);
}

export const roleGuard: CanActivateFn = (route) => roleResult(route.data['roles'] as UserRole[] | undefined);
export const roleMatchGuard: CanMatchFn = (route) => roleResult(route.data?.['roles'] as UserRole[] | undefined);
