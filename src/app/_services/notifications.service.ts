import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiResponse, CreateNotificationRequest, NotificationListRequest, NotificationResponse, PaginatedResponse } from '../_shared/types';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  getAll(isAdmin: boolean, request: NotificationListRequest = { page: 1, pageSize: 500 }) {
    let params = new HttpParams();
    if (request.page !== undefined) params = params.set('page', request.page);
    if (request.pageSize !== undefined) params = params.set('pageSize', request.pageSize);
    if (request.unreadOnly !== undefined) params = params.set('unreadOnly', request.unreadOnly);
    if (request.type !== undefined) params = params.set('type', request.type);

    return this.http.get<ApiResponse<PaginatedResponse<NotificationResponse>>>(
      isAdmin ? `${this.apiUrl}/admin/notifications` : `${this.apiUrl}/notifications`,
      { params },
    );
  }

  createGlobal(request: CreateNotificationRequest) {
    return this.http.post<ApiResponse<NotificationResponse>>(`${this.apiUrl}/admin/notifications/global`, request);
  }
}
