import {
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeSrLatn from '@angular/common/locales/sr-Latn';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { App, routes } from './app/app';
import { httpInterceptor } from './app/_shared/interceptors/http.interceptor';
import { loadingInterceptor } from './app/_shared/interceptors/loading.interceptor';
import { AuthService } from './app/_services/auth.service';
import { catchError, firstValueFrom, of } from 'rxjs';

registerLocaleData(localeSrLatn);

bootstrapApplication(App, {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([httpInterceptor, loadingInterceptor])),
    provideRouter(routes),
    provideAppInitializer(() => {
      const authService = inject(AuthService);

      if (!authService.hasRefreshToken()) {
        return;
      }

      return firstValueFrom(
        authService.refreshSession().pipe(
          catchError(() => {
            authService.clearSession();
            return of(null);
          }),
        ),
      );
    }),
  ],
}).catch((err) => console.error(err));
