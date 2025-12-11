import api from './api';
import { ENDPOINTS } from '../utils/constants';

const categoryService = {
  // Get all categories (LIBRARIAN only based on your backend)
  getAllCategories: async () => {
    try {
      const response = await api.get(ENDPOINTS.CATEGORIES);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch categories';
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.CATEGORY_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch category';
    }
  },

  // Create category (LIBRARIAN only)
  createCategory: async (categoryData) => {
    try {
      const response = await api.post(ENDPOINTS.CATEGORIES, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to create category';
    }
  },

  // Update category (LIBRARIAN only)
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(ENDPOINTS.CATEGORY_BY_ID(id), categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update category';
    }
  },

  // Delete category (LIBRARIAN only)
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(ENDPOINTS.CATEGORY_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to delete category';
    }
  },
};

export default categoryService;