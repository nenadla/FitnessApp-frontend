import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiResponse, MembershipHistoryResponse } from '../_shared/types';

@Injectable({ providedIn: 'root' })
export class MembershipsService {
  private readonly http = inject(HttpClient);
  private readonly membershipsUrl = `${environment.apiUrl}/api/me/memberships`;

  getHistory() {
    return this.http.get<ApiResponse<MembershipHistoryResponse[]>>(`${this.membershipsUrl}/history`);
  }
}
