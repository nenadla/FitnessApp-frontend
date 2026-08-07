import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet, Routes } from '@angular/router';
import { authGuard } from './_shared/guards/auth.guard';
import { guestGuard } from './_shared/guards/guest.guard';
import { configureHandler } from './_shared/http-handler';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from './_services/loading.service';
import { SharedService } from './_services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { copy, getErrorMessage } from './_shared/methods';
import { ToastDialog } from './_components/toast-dialog/toast-dialog';

export const routes: Routes = [
  {
    path: '',
    canActivate: [guestGuard],
    loadComponent: () => import('./public/landing/landing').then((component) => component.LandingComponent),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/login/login').then((component) => component.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/register/register').then((component) => component.RegisterComponent),
  },
  {
    path: 'forgot-password',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/forgot-password/forgot-password').then((component) => component.ForgotPasswordComponent),
  },
  {
    path: 'reset-password',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/reset-password/reset-password').then((component) => component.ResetPasswordComponent),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () => import('./home/home').then((home) => home.homeRoutes),
  },
  { path: '**', redirectTo: 'home/dashboard' },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {

  private readonly destroyRef = inject(DestroyRef);

  loadingService = inject(LoadingService);
  sharedService = inject(SharedService);
  dialog = inject(MatDialog);
  router = inject(Router);

  toast$ = toObservable(this.sharedService.toast);


  ngOnInit(): void {
    this.setHandler();
    this.setToast();
  }
  
  setHandler(){
    const nonExceptionStatuses = new Set([400, 401, 403, 404, 409, 422]);
    configureHandler({
      defaultErrorHandler: (error: HttpErrorResponse) => {
        console.log('HTTP Error:', error);
        const errors = error.error?.errors;
        const text = Array.isArray(errors) && errors.length > 0 ? errors.join(' ') : getErrorMessage(error);
        this.sharedService.toast.set({show: true, title: error.error?.code, text: text, type: 'error'});
      }
    });
  }

  setToast(){
    this.toast$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(toast => {
      if(toast.show){
        this.dialog.open(ToastDialog, {
          position: {left:'24px', bottom: '24px'},
          autoFocus: false,
          restoreFocus: false,
          panelClass: ['panel-right-no-borders', 'rounded-xl'],
          backdropClass: 'hidden',
          disableClose: true,
          data: copy(toast)
        }).afterClosed().subscribe(() => {
          this.sharedService.toast.set({show: false});
        });
      }
    });
    // this.sharedService.toast.set({show: true, title: 'Success', text: 'Successfully Created', type: 'success'});

  }

}
