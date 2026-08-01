import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../../_services/loading.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const loadingService = inject(LoadingService);
  loadingService.totalRequests.update(r => r + 1);
  loadingService.setLoading(true);

  return next(req).pipe(finalize(() => {
    loadingService.totalRequests.update(r => r - 1);
    if (loadingService.totalRequests() === 0) {
      loadingService.setLoading(false);
    }
  }));
};
