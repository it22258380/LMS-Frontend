'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { useRouter } from 'next/navigation';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials);
      let finalUser = result.user;

      // If role is missing or default USER, detect role via endpoint
      if (!finalUser.role || finalUser.role === 'USER') {
        try {
          const detectedRole = await authService.detectRoleByEndpoint();
          finalUser = { ...finalUser, role: detectedRole };
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(finalUser));
          console.log('✅ Role detected:', detectedRole);
        } catch {
          console.log('⚠️ Role detection failed, using default USER');
        }
      }

      setUser(finalUser);

      // Redirect based on role
      switch (finalUser.role) {
        case 'LIBRARIAN':
          router.push('/librarian/dashboard');
          break;
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/user/dashboard');
      }

      return { success: true, user: finalUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      await authService.signup(userData);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'Signup failed' };
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/auth/login');
  };

  // Check if user has specific role
  const hasRole = (role) => user?.role === role;

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    hasRole,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
