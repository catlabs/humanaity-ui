import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthRequest } from './models/auth-request';
import { SignupRequest } from './models/signup-request';
import { AuthResponse } from './models/auth-response';
import { RefreshTokenRequest } from './models/refresh-token-request';

const API_URL = 'http://localhost:8080/auth';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/login`, request).pipe(
      tap(response => this.setTokens(response))
    );
  }

  signup(request: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/signup`, request).pipe(
      tap(response => this.setTokens(response))
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const request: RefreshTokenRequest = { refreshToken };
    return this.http.post<AuthResponse>(`${API_URL}/refresh`, request).pipe(
      tap(response => this.setTokens(response))
    );
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      const request: RefreshTokenRequest = { refreshToken };
      this.http.post(`${API_URL}/logout`, request).subscribe();
    }
    this.clearTokens();
  }

  getAccessToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    // Note: In production, consider using HttpOnly cookies for refresh tokens
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    // Note: In production, consider using HttpOnly cookies for refresh tokens
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    // Simple check: decode and verify expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiration;
    } catch {
      return false;
    }
  }

  private setTokens(response: AuthResponse): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
  }

  private clearTokens(): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

