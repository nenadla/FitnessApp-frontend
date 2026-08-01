import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  CreatePaymentRequest,
  EmptyResponse,
  PaymentListRequest,
  PaymentPaginatedResponse,
  PaymentResponse,
  UpdatePaymentRequest,
} from '../_shared/types';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private readonly http = inject(HttpClient);
  private readonly paymentsUrl = `${environment.apiUrl}/api/admin/payments`;

  getAll(request: PaymentListRequest = { page: 1, pageSize: 500 }) {
    let params = new HttpParams();

    if (request.page !== undefined) {
      params = params.set('page', request.page);
    }

    if (request.pageSize !== undefined) {
      params = params.set('pageSize', request.pageSize);
    }

    if (request.paymentType !== undefined) {
      params = params.set('paymentType', request.paymentType);
    }

    if (request.userId) {
      params = params.set('userId', request.userId);
    }

    if (request.fromDate) {
      params = params.set('fromDate', request.fromDate);
    }

    if (request.toDate) {
      params = params.set('toDate', request.toDate);
    }

    if (request.search) {
      params = params.set('search', request.search);
    }

    return this.http.get<ApiResponse<PaymentPaginatedResponse>>(this.paymentsUrl, { params });
  }

  create(request: CreatePaymentRequest) {
    return this.http.post<ApiResponse<PaymentResponse>>(this.paymentsUrl, request);
  }

  update(id: string, request: UpdatePaymentRequest) {
    return this.http.put<ApiResponse<PaymentResponse>>(`${this.paymentsUrl}/${id}`, request);
  }

  delete(id: string) {
    return this.http.delete<ApiResponse<EmptyResponse>>(`${this.paymentsUrl}/${id}`);
  }
}
