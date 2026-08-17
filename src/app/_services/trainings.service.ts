import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  CreateTrainingSessionRequest,
  EmptyResponse,
  TrainingCalendarResponse,
  TrainingListRequest,
} from '../_shared/types';

@Injectable({ providedIn: 'root' })
export class TrainingsService {
  private readonly http = inject(HttpClient);
  private readonly trainingsUrl = `${environment.apiUrl}/api/trainings`;

  getAll(request: TrainingListRequest = {}) {
    let params = new HttpParams();

    if (request.date) {
      params = params.set('date', request.date);
    }

    if (request.isCancelled !== undefined) {
      params = params.set('isCancelled', request.isCancelled);
    }

    if (request.activeOnly !== undefined) {
      params = params.set('activeOnly', request.activeOnly);
    }

    return this.http.get<ApiResponse<TrainingCalendarResponse[]>>(this.trainingsUrl, { params });
  }

  create(request: CreateTrainingSessionRequest) {
    return this.http.post<ApiResponse<EmptyResponse>>(`${environment.apiUrl}/api/admin/trainings`, request);
  }

  delete(id: string) {
    return this.http.delete<ApiResponse<EmptyResponse>>(`${environment.apiUrl}/api/admin/trainings/${id}`);
  }
}
