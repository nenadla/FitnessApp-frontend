import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiResponse, AvailablePackageResponse } from '../_shared/types';

@Injectable({ providedIn: 'root' })
export class BalancesService {
  private readonly http = inject(HttpClient);

  getAvailablePackages() {
    return this.http.get<ApiResponse<AvailablePackageResponse[]>>(`${environment.apiUrl}/api/admin/balances/packages`);
  }
}
