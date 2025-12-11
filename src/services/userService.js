import api from './api';
import { ENDPOINTS } from '../utils/constants';

const userService = {
  // Get user profile by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.USER_PROFILE(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch user';
    }
  },

  // Update user profile
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(ENDPOINTS.USER_PROFILE(id), userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update user';
    }
  },

  // Update user role (LIBRARIAN only)
  updateUserRole: async (id, role) => {
    try {
      const response = await api.put(ENDPOINTS.UPDATE_ROLE(id), { role });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update user role';
    }
  },

  // Toggle blacklist status (LIBRARIAN only)
  toggleBlacklist: async (id) => {
    try {
      const response = await api.put(ENDPOINTS.TOGGLE_BLACKLIST(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to toggle blacklist status';
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(ENDPOINTS.USER_PROFILE(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to delete user';
    }
  },
};

export default userService;