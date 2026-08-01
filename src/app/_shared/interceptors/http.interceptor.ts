import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../_services/auth.service';

const RETRIED_AFTER_REFRESH = new HttpContextToken<boolean>(() => false);
const AUTH_PATHS = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh-token', '/api/auth/logout'];

let refreshInFlight$:
  | ReturnType<AuthService['refreshSession']>
  | undefined;

export const httpInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  if (AUTH_PATHS.some((path) => request.url.includes(path))) {
    return next(request);
  }

  const addAccessToken = (token: string | null) =>
    token
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;

  return next(addAccessToken(authService.getAccessToken())).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status !== 401 ||
        request.context.get(RETRIED_AFTER_REFRESH) ||
        !authService.hasRefreshToken()
      ) {
        return throwError(() => error);
      }

      if (!refreshInFlight$) {
        refreshInFlight$ = authService.refreshSession().pipe(
          finalize(() => (refreshInFlight$ = undefined)),
          shareReplay({ bufferSize: 1, refCount: false }),
        );
      }

      return refreshInFlight$.pipe(
        switchMap(() => {
          const retryRequest = addAccessToken(authService.getAccessToken()).clone({
            context: request.context.set(RETRIED_AFTER_REFRESH, true),
          });

          return next(retryRequest);
        }),
        catchError((refreshError: HttpErrorResponse) => {
          authService.clearSession();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
