// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError, finalize, delay } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginCredentials, AuthResponse, User, TokenPayload } from '../models/auth.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}`;
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  private jwtHelper = new JwtHelperService();
  private refreshTokenTimeout: any;
  private refreshInProgress = false;

  constructor(private http: HttpClient) {
    // Only initialize auth if a token exists
    if (this.getToken()) {
      this.initializeAuth();
    }
  }

  // Initialize authentication state
  private initializeAuth(): void {
    try {
      const token = this.getToken();
      if (token && !this.isTokenExpired(token)) {
        this.startRefreshTokenTimer();
      } else {
        // Try to refresh the token if we have a refresh token
        const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
        if (refreshToken) {
          this.refreshToken().subscribe({
            error: () => this.logout(false) // Silent logout on refresh failure
          });
        } else {
          this.logout(false); // Silent logout
        }
      }
    } catch (err) {
      console.error('Error in initializeAuth:', err);
      this.logout(false);
    }
  }

  // Get current user as observable
  currentUser$ = this.currentUserSubject.asObservable();

  // Get current user value
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Login with improved error handling
  login(credentials: LoginCredentials): Observable<User> {
    // Always include the tenant ID header
    const headers = new HttpHeaders().set('x-tenant-id', 'default-tenant');
    
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth/login`, 
      credentials,
      { headers }
    ).pipe(
      // Log the raw response for debugging
      tap(response => {
        console.log('Raw login response:', response);
      }),
      // Handle the authentication
      tap(response => this.handleAuthResponse(response)),
      // Return just the user
      map(response => response.user),
      // Better error handling
      catchError((error: HttpErrorResponse) => {
        console.error('Login error status:', error.status);
        console.error('Login error details:', error);
        
        // More specific error messages based on status codes
        let errorMsg = 'Login failed';
        
        if (error.status === 0) {
          errorMsg = 'Cannot connect to server. Please check your internet connection.';
        } else if (error.status === 401) {
          errorMsg = 'Invalid email or password';
        } else if (error.status === 403) {
          errorMsg = 'Access forbidden. Please check your credentials.';
        } else if (error.status === 404) {
          errorMsg = 'Login service not found. Please contact support.';
        } else if (error.status >= 500) {
          errorMsg = 'Server error. Please try again later.';
        }
        
        return throwError(() => {
          return { 
            error: { message: errorMsg },
            status: error.status
          };
        });
      }),
      // Always mark loading as complete
      finalize(() => {
        console.log('Login request completed');
      })
    );
  }

  // Logout
  logout(callServer = true): void {
    // Stop refresh timer
    this.stopRefreshTokenTimer();

    // Clear local storage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    // Clear current user
    this.currentUserSubject.next(null);

    // Optional: Call logout endpoint
    if (callServer) {
      const headers = new HttpHeaders().set('x-tenant-id', 'default-tenant');
      this.http.post(`${this.API_URL}/auth/logout`, {}, { headers })
        .pipe(
          catchError(err => {
            console.error('Logout API error:', err);
            return of(null);
          })
        )
        .subscribe();
    }
  }

  // Refresh token
  refreshToken(): Observable<AuthResponse> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshInProgress) {
      return throwError(() => new Error('Refresh already in progress'));
    }
    
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    this.refreshInProgress = true;
    
    const headers = new HttpHeaders().set('x-tenant-id', 'default-tenant');
    
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth/refresh`, 
      { refreshToken },
      { headers }
    ).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(error => {
        console.error('Token refresh failed:', error);
        this.logout(false);  // Silent logout on refresh error
        return throwError(() => error);
      }),
      finalize(() => {
        this.refreshInProgress = false;
      })
    );
  }

  // Check if user is authenticated
  isAuthenticated(): Observable<boolean> {
    try {
      // Check if token is expired
      const token = this.getToken();
      if (!token || this.isTokenExpired(token)) {
        return of(false);
      }
      
      return this.currentUser$.pipe(
        map(user => !!user)
      );
    } catch (err) {
      console.error('Error in isAuthenticated:', err);
      return of(false);
    }
  }

  // Check if user has required role
  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  // Check if user has required permission
  hasPermission(permission: string): boolean {
    return this.currentUser?.permissions?.includes(permission) ?? false;
  }

  // Get current token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Private helper methods
  private handleAuthResponse(response: AuthResponse): void {
    // Safety check
    if (!response) {
      console.error('Empty auth response');
      return;
    }
    
    console.log('Processing auth response:', response);
    
    try {
      // Save tokens
      if (response.access_token) {
        localStorage.setItem(this.TOKEN_KEY, response.access_token);
      } else {
        console.error('Missing access token in response');
      }
      
      if (response.refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
      } else {
        console.error('Missing refresh token in response');
      }
      
      // Save user with safety checks
      if (response.user) {
        const user = {
          ...response.user,
          permissions: response.user.permissions || []
        };
        
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
        
        // Start refresh token timer
        this.startRefreshTokenTimer();
      } else {
        console.error('Missing user in response');
      }
    } catch (err) {
      console.error('Error processing auth response:', err);
    }
  }

  private getUserFromStorage(): User | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      return user;
    } catch (e) {
      console.error('Error parsing user from storage', e);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      return this.jwtHelper.isTokenExpired(token);
    } catch (e) {
      console.error('Error checking token expiration', e);
      return true; // Consider invalid tokens as expired
    }
  }

  private startRefreshTokenTimer(): void {
    try {
      this.stopRefreshTokenTimer(); // Clear any existing timer
      
      const token = this.getToken();
      if (!token) return;

      const decoded = this.jwtHelper.decodeToken<TokenPayload>(token);
      if (!decoded || !decoded.exp) return;
      
      const expires = new Date(decoded.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiry
      
      if (timeout <= 0) {
        // Token is already expired or about to expire, refresh immediately
        this.refreshToken().subscribe({
          error: (err) => console.error('Immediate token refresh failed:', err)
        });
        return;
      }

      console.log(`Token refresh scheduled in ${Math.floor(timeout / 1000)} seconds`);
      this.refreshTokenTimeout = setTimeout(() => {
        this.refreshToken().subscribe({
          error: (err) => console.error('Scheduled token refresh failed:', err)
        });
      }, timeout);
    } catch (err) {
      console.error('Error starting refresh timer:', err);
    }
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = null;
    }
  }
}