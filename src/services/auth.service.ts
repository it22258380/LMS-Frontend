import apiService from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await apiService.get<AuthResponse['user']>('/auth/me');
    return response.data;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear cookie
      document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  },

  getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  getStoredUser(): AuthResponse['user'] | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  storeAuth(token: string, user: AuthResponse['user']): void {
    if (typeof window !== 'undefined') {
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Also store token in cookie for middleware
      // Cookie will expire in 7 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      document.cookie = `auth_token=${token}; Path=/; Expires=${expiryDate.toUTCString()}; SameSite=Strict`;
      
      // Set token in API service
      apiService.setToken(token);
    }
  }
};