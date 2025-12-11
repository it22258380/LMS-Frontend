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
      console.log("LOGIN RESPONSE:", response.data);
      const { accessToken } = response.data;
      
      // Store token
      localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
      
      // Decode JWT to inspect its contents
      const decodedToken = jwtDecode(accessToken);
      console.log('🔍 Full Decoded JWT Token:', decodedToken);
      
      // Try to extract role from different possible locations
      let role = 'USER'; // Default role
      
      // Method 1: Check 'roles' claim (if backend is updated)
      if (decodedToken.roles) {
        role = decodedToken.roles.replace('ROLE_', '');
        console.log('✅ Found role in "roles" claim:', role);
      }
      // Method 2: Check authorities array
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
      // Method 3: Fallback - Fetch user profile to get role
      else {
        console.log('⚠️ Role not in JWT, fetching from profile...');
        try {
          
          const email = decodedToken.sub;
          
          
          if (response.data.role) {
            role = response.data.role;
            console.log(' Found role in login response:', role);
          } else {
           
            console.log('Could not determine role from JWT or response');
          }
        } catch (error) {
          console.error('Failed to fetch user role:', error);
        }
      }
      
      const userInfo = {
        email: decodedToken.sub,
        role: role
      };
      
      console.log('💾 Storing user info:', userInfo);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userInfo));
      
      return { token: accessToken, user: userInfo };
    } catch (error) {
      throw error.response?.data || 'Login failed';
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
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
    } catch {
      return false;
    }
  },

  // Get user role from token
  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user?.role || null;
  },

  // Helper function to detect role by testing LIBRARIAN-only endpoint
  detectRoleByEndpoint: async () => {
    try {
      // Try to access a LIBRARIAN-only endpoint
      await api.get('/api/categories');
      // If successful, user is LIBRARIAN
      return 'LIBRARIAN';
    } catch (error) {
      // If 403, user is USER
      if (error.response && error.response.status === 403) {
        return 'USER';
      }
      // Otherwise, unknown error
      return 'USER';
    }
  }
};

export default authService;