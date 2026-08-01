import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiResponse, ChangePasswordRequest, EmptyResponse, UpdateProfileRequest, UserProfileResponse } from '../_shared/types';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly profileUrl = `${environment.apiUrl}/api/users`;

  getMe() {
    return this.http.get<ApiResponse<UserProfileResponse>>(`${this.profileUrl}/me`);
  }

  update(request: UpdateProfileRequest) {
    return this.http.put<ApiResponse<UserProfileResponse>>(`${this.profileUrl}/me`, request);
  }

  changePassword(request: ChangePasswordRequest) {
    return this.http.put<ApiResponse<EmptyResponse>>(`${this.profileUrl}/change-password`, request);
  }
}
