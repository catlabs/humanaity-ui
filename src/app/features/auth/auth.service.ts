import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap, map, switchMap, of, from } from 'rxjs';
import { AuthControllerService } from '../../api/api/authController.service';
import { AuthRequest, SignupRequest, RefreshTokenRequest } from '../../api/model/models';
import { AuthResponse } from '../../api/model/authResponse';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authControllerService = inject(AuthControllerService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.authControllerService.login(request).pipe(
      switchMap((response: any) => {
        // Handle Blob response (can happen with fetch API)
        if (response instanceof Blob) {
          return from(new Promise<any>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              try {
                const text = reader.result as string;
                resolve(JSON.parse(text));
              } catch (e) {
                reject(new Error('Failed to parse JSON response: ' + e));
              }
            };
            reader.onerror = () => reject(new Error('Failed to read Blob'));
            reader.readAsText(response);
          }));
        }
        return of(response);
      }),
      map((response: any) => {
        // Extract tokens
        const authResponse: AuthResponse = {
          accessToken: response?.accessToken || response?.access_token,
          refreshToken: response?.refreshToken || response?.refresh_token
        };
        
        if (!authResponse.accessToken || !authResponse.refreshToken) {
          throw new Error('Invalid response structure: tokens not found');
        }
        
        return authResponse;
      }),
      tap(response => {
        this.setTokens(response);
      })
    );
  }

  signup(request: SignupRequest): Observable<AuthResponse> {
    return this.authControllerService.signup(request).pipe(
      map((response: any) => {
        const authResponse: AuthResponse = {
          accessToken: response.accessToken || response.access_token,
          refreshToken: response.refreshToken || response.refresh_token
        };
        return authResponse;
      }),
      tap(response => this.setTokens(response))
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const request: RefreshTokenRequest = { refreshToken };
    return this.authControllerService.refresh(request).pipe(
      map((response: any) => {
        const authResponse: AuthResponse = {
          accessToken: response.accessToken || response.access_token,
          refreshToken: response.refreshToken || response.refresh_token
        };
        return authResponse;
      }),
      tap(response => this.setTokens(response))
    );
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      const request: RefreshTokenRequest = { refreshToken };
      this.authControllerService.logout(request).subscribe();
    }
    this.clearTokens();
  }

  getAccessToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
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
    if (!response.accessToken || !response.refreshToken) {
      throw new Error('Invalid authentication response: missing tokens');
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
