import api from './api';
import { ENDPOINTS, STORAGE_KEYS } from '../utils/constants';
import { jwtDecode } from 'jwt-decode';

const authService = {
  // Sign up new user
  signup: async (userData) => {
    try {
      const response = await api.post(ENDPOINTS.SIGNUP, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Signup failed';
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN, credentials);
      console.log('📥 LOGIN RESPONSE:', response.data);
      
      const { accessToken } = response.data;
      
      // Store token
      localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
      
      // Decode JWT to extract user info
      const decodedToken = jwtDecode(accessToken);
      console.log('🔍 Full Decoded JWT Token:', decodedToken);
      
      // Try to extract role from different possible JWT claim locations
      let role = 'USER'; // Default role
      
      // Method 1: Check 'role' or 'roles' claim
      if (decodedToken.role) {
        role = decodedToken.role.replace('ROLE_', '');
        console.log('✅ Found role in "role" claim:', role);
      } else if (decodedToken.roles) {
        role = decodedToken.roles.replace('ROLE_', '');
        console.log('✅ Found role in "roles" claim:', role);
      }
      // Method 2: Check 'authorities' array
      else if (decodedToken.authorities) {
        if (Array.isArray(decodedToken.authorities)) {
          const authority = decodedToken.authorities[0];
          if (typeof authority === 'string') {
            role = authority.replace('ROLE_', '');
          } else if (authority.authority) {
            role = authority.authority.replace('ROLE_', '');
          }
        }
        console.log('✅ Found role in "authorities":', role);
      }
      // Method 3: Check if role is in the response body
      else if (response.data.role) {
        role = response.data.role.replace('ROLE_', '');
        console.log('✅ Found role in login response body:', role);
      }
      // Method 4: Last fallback - default to USER
      else {
        console.log('⚠️ Could not determine role from JWT or response, defaulting to USER');
      }
      
      // Create user info object
      const userInfo = {
        email: decodedToken.sub,
        role: role
      };
      
      console.log('💾 Storing user info:', userInfo);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userInfo));
      
      return { token: accessToken, user: userInfo };
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error.response?.data || 'Login failed';
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    console.log('👋 User logged out');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        return null;
      }
    }
    return null;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return false;
    }
  },

  // Get user role from token
  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user?.role || null;
  }
};

export default authService;