import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiResponse, EmptyResponse, UserListRequest, UserPaginatedResponse } from '../_shared/types';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly usersUrl = `${environment.apiUrl}/api/admin/users`;

  getAll(request: UserListRequest = { page: 1, pageSize: 500 }) {
    let params = new HttpParams();

    if (request.page !== undefined) {
      params = params.set('page', request.page);
    }

    if (request.pageSize !== undefined) {
      params = params.set('pageSize', request.pageSize);
    }

    if (request.status !== undefined) {
      params = params.set('status', request.status);
    }

    if (request.search) {
      params = params.set('search', request.search);
    }

    return this.http.get<ApiResponse<UserPaginatedResponse>>(this.usersUrl, { params });
  }

  verify(id: string) {
    return this.http.post<ApiResponse<EmptyResponse>>(`${this.usersUrl}/${id}/verify`, null);
  }

  block(id: string) {
    return this.http.post<ApiResponse<EmptyResponse>>(`${this.usersUrl}/${id}/block`, null);
  }

  unblock(id: string) {
    return this.http.post<ApiResponse<EmptyResponse>>(`${this.usersUrl}/${id}/unblock`, null);
  }
}
