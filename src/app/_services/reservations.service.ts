import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiResponse, CreateReservationRequest, ReservationListRequest, ReservationPaginatedResponse, ReservationResponse } from '../_shared/types';

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly http = inject(HttpClient);
  private readonly reservationsUrl = `${environment.apiUrl}/api/admin/reservations`;

  getAll(request: ReservationListRequest = { page: 1, pageSize: 500 }) {
    let params = new HttpParams();

    if (request.page !== undefined) {
      params = params.set('page', request.page);
    }

    if (request.pageSize !== undefined) {
      params = params.set('pageSize', request.pageSize);
    }

    if (request.trainingSessionId) {
      params = params.set('trainingSessionId', request.trainingSessionId);
    }

    return this.http.get<ApiResponse<ReservationPaginatedResponse>>(this.reservationsUrl, { params });
  }

  create(request: CreateReservationRequest) {
    return this.http.post<ApiResponse<ReservationResponse>>(`${environment.apiUrl}/api/reservations`, request);
  }

  getMyUpcoming() {
    return this.http.get<ApiResponse<ReservationResponse[]>>(`${environment.apiUrl}/api/reservations/my/upcoming`);
  }

  cancel(id: string) {
    return this.http.post<ApiResponse<ReservationResponse>>(`${environment.apiUrl}/api/reservations/${id}/cancel`, null);
  }
}
