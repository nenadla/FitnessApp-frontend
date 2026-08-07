import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  AuthResponse,
  ForgotPasswordRequest,
  CurrentUserResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  RevokeTokenRequest,
  ResetPasswordRequest,
  UserProfile,
  UserStatus,
} from '../_shared/types';

const REFRESH_TOKEN_STORAGE_KEY = 'retro-fitness.refresh-token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = `${environment.apiUrl}/api/auth`;

  private readonly accessToken = signal<string | null>(null);
  readonly currentUser = signal<CurrentUserResponse | null>(null);
  readonly isAuthorized = computed(() => this.accessToken() !== null && this.currentUser()?.userStatus === UserStatus.Verified);

  register(request: RegisterRequest) {
    return this.http.post<ApiResponse<CurrentUserResponse>>(`${this.authUrl}/register`, request);
  }

  login(request: LoginRequest) {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.authUrl}/login`, request)
      .pipe(map((response) => this.storeSession(response.data)));
  }

  forgotPassword(request: ForgotPasswordRequest) {
    return this.http.post<ApiResponse<unknown>>(`${this.authUrl}/forgot-password`, request);
  }

  resetPassword(request: ResetPasswordRequest) {
    return this.http.post<ApiResponse<unknown>>(`${this.authUrl}/reset-password`, request);
  }

  refreshSession() {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('Nema aktivne sesije za osvežavanje tokena.');
    }

    const request: RefreshTokenRequest = { refreshToken };

    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.authUrl}/refresh-token`, request)
      .pipe(map((response) => this.storeSession(response.data)));
  }

  logout() {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.clearSession();
      return;
    }

    const request: RevokeTokenRequest = { refreshToken };
    return this.http
      .post<ApiResponse<unknown>>(`${this.authUrl}/logout`, request)
      .pipe(finalize(() => this.clearSession()));
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  hasRefreshToken(): boolean {
    return this.getRefreshToken() !== null;
  }

  // Retained for the existing legacy guard until its routes are migrated.
  getUserProfile() {
    return this.http.get<UserProfile>(`${environment.apiUrl}/api/users/me`);
  }

  clearSession(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }

  updateCurrentUser(firstName: string, lastName: string): void {
    this.currentUser.update((user) => user ? { ...user, firstName, lastName } : null);
  }

  private storeSession(session: AuthResponse): AuthResponse {
    if (session.userStatus !== UserStatus.Verified) {
      this.clearSession();
      throw new Error('Nalog mora biti verifikovan pre prijave.');
    }

    this.accessToken.set(session.accessToken);
    this.currentUser.set({
      userId: session.userId,
      email: session.email,
      firstName: session.firstName,
      lastName: session.lastName,
      role: session.role,
      userStatus: session.userStatus,
    });
    sessionStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, session.refreshToken);

    return session;
  }

  private getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  }
}
