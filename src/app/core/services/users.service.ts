import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string; // Only used during registration, not stored in local user object
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  dateJoined?: Date;
  orders?: string[]; // IDs of orders
  wishlist?: string[]; // IDs of wishlist items
  role?: 'customer' | 'admin';
  profileImage?: string;
  marketingPreferences?: {
    emailOffers: boolean;
    smsOffers: boolean;
    personalizedAds: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  // Load user from localStorage on service initialization
  private loadUserFromStorage(): void {
    try {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      localStorage.removeItem('currentUser');
    }
  }

  // Register a new user
  register(user: User): Observable<User> {
    // In a real application, this would make an HTTP POST request to your backend
    return this.http.post<User>(`${this.apiUrl}/auth/signup`, user).pipe(
      tap(response => {
        // Don't automatically log them in after registration
        // They need to verify email or log in manually
        return response;
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Registration failed. Please try again.'));
      })
    );
  }

  // For demo purposes, simulate registration without a backend
  simulateRegister(user: User): Observable<User> {
    // Remove password before storing
    const { password, ...userWithoutPassword } = user;
    
    // Add additional user properties
    const newUser = {
      ...userWithoutPassword,
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      dateJoined: new Date(),
      role: 'customer' as const,
      orders: [],
      wishlist: []
    };

    // Simulate an API delay
    return of(newUser).pipe(
      tap(user => {
        console.log('User registered:', user);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => new Error('Registration failed. Please try again.'));
      })
    );
  }

  // Log in a user
  login(email: string, password: string): Observable<User> {
    // In a real application, this would make an HTTP POST request to your backend
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(user => {
        // Store user details and token in local storage
        this.storeUserSession(user);
        return user;
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Login failed. Please check your credentials.'));
      })
    );
  }

  // Simulate login without a backend
  simulateLogin(email: string, password: string): Observable<User> {
    // For demo, accept any credentials with basic validation
    if (!email || !password) {
      return throwError(() => new Error('Email and password are required.'));
    }

    // Create a mock user
    const user: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      firstName: email.split('@')[0], // Just use part of email as name for demo
      lastName: 'User',
      email: email,
      dateJoined: new Date(),
      role: 'customer',
      orders: [],
      wishlist: []
    };

    // Store in local storage
    this.storeUserSession(user);
    return of(user);
  }

  // Store user session information
  private storeUserSession(user: User): void {
    // Don't store password in local storage
    const { password, ...userToStore } = user as any;
    
    // Store user in local state
    this.currentUserSubject.next(userToStore);
    
    // Store in localStorage for persistence across refreshes
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
  }

  // Log out the current user
  logout(): void {
    // In a real app, you might want to invalidate the token on the server
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Get the current user value
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserr(): Observable <User|null > {
    return this.currentUserSubject.asObservable();

  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Update user profile
  updateProfile(user: Partial<User>): Observable<User> {
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('No user is currently logged in.'));
    }

    // In a real app, this would be an HTTP PUT request
    return this.http.put<User>(`${this.apiUrl}/${currentUser.id}`, user).pipe(
      tap(updatedUser => {
        // Update stored user
        const mergedUser = { ...currentUser, ...updatedUser };
        this.storeUserSession(mergedUser);
        return mergedUser;
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Failed to update profile.'));
      })
    );
  }

  // Simulate updating profile without a backend
  simulateUpdateProfile(updates: Partial<User>): Observable<User> {
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('No user is currently logged in.'));
    }

    // Merge current user with updates
    const updatedUser = { ...currentUser, ...updates };
    
    // Update stored user
    this.storeUserSession(updatedUser);
    return of(updatedUser);
  }

  // Request password reset
  requestPasswordReset(email: string): Observable<boolean> {
    // In a real app, this would send a password reset email
    return this.http.post<boolean>(`${this.apiUrl}/request-password-reset`, { email }).pipe(
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Failed to request password reset.'));
      })
    );
  }

  // Simulate password reset request without a backend
  simulateRequestPasswordReset(email: string): Observable<boolean> {
    console.log(`Password reset requested for ${email}`);
    return of(true);
  }
}