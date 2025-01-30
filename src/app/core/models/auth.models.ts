// src/app/core/models/auth.models.ts
export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: User;
    expiresIn: number;
  }
  
  export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'super_admin' | 'staff';
    permissions: string[];
  }
  
  export interface TokenPayload {
    sub: number;
    email: string;
    role: string;
    exp: number;
  }