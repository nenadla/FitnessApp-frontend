import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiResponse, UserDashboardResponse } from '../_shared/types';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getUserDashboard() {
    return this.http.get<ApiResponse<UserDashboardResponse>>(`${environment.apiUrl}/api/me/dashboard`);
  }
}
