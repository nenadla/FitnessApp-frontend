import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiResponse, AvailablePackageResponse, BalanceResponse, LandingPackageResponse, UpdateBalanceRequest } from '../_shared/types';

@Injectable({ providedIn: 'root' })
export class BalancesService {
  private readonly http = inject(HttpClient);

  update(balanceId: string, request: UpdateBalanceRequest) {
    return this.http.put<ApiResponse<BalanceResponse>>(`${environment.apiUrl}/api/admin/balances/${balanceId}`, request);
  }

  getAvailablePackages() {
    return this.http.get<ApiResponse<AvailablePackageResponse[]>>(`${environment.apiUrl}/api/admin/balances/packages`);
  }

  getLandingPackages() {
    return this.http.get<ApiResponse<LandingPackageResponse[]>>(`${environment.apiUrl}/api/admin/balances/packages`);
  }
}
