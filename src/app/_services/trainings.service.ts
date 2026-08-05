import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  CreateTrainingSessionRequest,
  EmptyResponse,
  TrainingCalendarResponse,
  TrainingListRequest,
  TrainingSessionResponse,
  UpdateTrainingSessionRequest,
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
    return this.http.post<ApiResponse<TrainingSessionResponse>>(`${environment.apiUrl}/api/admin/trainings`, request);
  }

  getById(id: string) {
    return this.http.get<ApiResponse<TrainingSessionResponse>>(`${this.trainingsUrl}/${id}`);
  }

  update(id: string, request: UpdateTrainingSessionRequest) {
    return this.http.put<ApiResponse<TrainingSessionResponse>>(`${environment.apiUrl}/api/admin/trainings/${id}`, request);
  }

  delete(id: string) {
    return this.http.delete<ApiResponse<EmptyResponse>>(`${environment.apiUrl}/api/admin/trainings/${id}`);
  }
}
