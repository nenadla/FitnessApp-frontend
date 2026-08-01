import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of, finalize, take, tap } from 'rxjs';
import { AuthService } from '../../_services/auth.service';
import { LoadingService } from '../../_services/loading.service';
import { SharedService } from '../../_services/shared.service';
import { environment } from '../../../environments/environment';
import { Pages } from '../constants';


export const accessGuard: CanActivateFn = () => {
  const loadingService = inject(LoadingService);
  const sharedService = inject(SharedService);
  const authService = inject(AuthService);
  const router = inject(Router);

  loadingService.showLoader.set(true);
  return authService.getUserProfile().pipe(
    take(1), 
    tap(value => sharedService.userProfile.set(value)),
    map((value) => {
      // console.log(value)
      if(!value.accessIS){
        if(environment.env === 'Local'){
          router.navigate([Pages.Login]);
        }
        else{
          window.location.href = window.location.origin + (value.accessRP ? '/matrices' : '/login'); 
        } 
        return false;
      }
      return true;
    }),
    catchError((error) => {
      console.error('Error fetching user profile', error);
      if(environment.env === 'Local'){
        router.navigate([Pages.Login]);
      }
      else{
        window.location.href = window.location.origin + '/login'; 
      } 
      return of(false);
    }),
    finalize(() => loadingService.showLoader.set(false)) 
  );
};
