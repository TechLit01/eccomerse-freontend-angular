// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginCredentials, AuthResponse, User, TokenPayload } from '../models/auth.models';
import { environment } from '../../environments/environment';
import { Organization } from '../../shared/models/organization.model';

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

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

    findAll(): Observable<Organization[]> {
      const url = `${this.API_URL}/organizations`;
      return this.http.get<Organization[]>(url);
    }

  // Initialize authentication state
  private initializeAuth(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.startRefreshTokenTimer();
    } else {
      this.logout();
    }
  }

  // Get current user as observable
  currentUser$ = this.currentUserSubject.asObservable();

  // Get current user value
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Login
  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        map(response => response.user),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error(error.error?.message || 'Login failed'));
        })
      );
  }

  // Logout
  logout(): void {
    // Stop refresh timer
    this.stopRefreshTokenTimer();

    // Clear local storage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    // Clear current user
    this.currentUserSubject.next(null);

    // Optional: Call logout endpoint
    this.http.post(`${this.API_URL}/logout`, {}).subscribe();
  }

  // Refresh token
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, { refreshToken })
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  // Check if user is authenticated
  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  // Check if user has required role
  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  // Check if user has required permission
  hasPermission(permission: string): boolean {
    return this.currentUser?.permissions.includes(permission) ?? false;
  }

  // Get current token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Private helper methods
  private handleAuthResponse(response: AuthResponse): void {
    // Save tokens and user
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));

    // Update current user
    this.currentUserSubject.next(response.user);

    // Start refresh token timer
    this.startRefreshTokenTimer();
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  private startRefreshTokenTimer(): void {
    const token = this.getToken();
    if (!token) return;

    const decoded = this.jwtHelper.decodeToken<TokenPayload>(token);
    const expires = new Date(decoded!.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiry

    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().subscribe();
    }, timeout);
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }
}