import api from './api';
import { ENDPOINTS } from '../utils/constants';

const bookService = {
  // Get all books
  getAllBooks: async () => {
    try {
      const response = await api.get(ENDPOINTS.BOOKS);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch books';
    }
  },

  // Get book by ID
  getBookById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.BOOK_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch book';
    }
  },

  // Get books by category
  getBooksByCategory: async (categoryId) => {
    try {
      const response = await api.get(ENDPOINTS.BOOKS_BY_CATEGORY(categoryId));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch books by category';
    }
  },

  // Get available books
  getAvailableBooks: async () => {
    try {
      const response = await api.get(ENDPOINTS.BOOKS_AVAILABLE);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch available books';
    }
  },

  // Search books by title
  searchByTitle: async (title) => {
    try {
      const response = await api.get(ENDPOINTS.SEARCH_BY_TITLE, {
        params: { title }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to search books';
    }
  },

  // Search books by author
  searchByAuthor: async (author) => {
    try {
      const response = await api.get(ENDPOINTS.SEARCH_BY_AUTHOR, {
        params: { author }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to search books';
    }
  },

  // Search books by genre
  searchByGenre: async (genre) => {
    try {
      const response = await api.get(ENDPOINTS.SEARCH_BY_GENRE, {
        params: { genre }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to search books';
    }
  },

  // Create book (LIBRARIAN only)
  createBook: async (bookData) => {
    try {
      const response = await api.post(ENDPOINTS.BOOKS, bookData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to create book';
    }
  },

  // Create book with image (LIBRARIAN only)
  createBookWithImage: async (formData) => {
    try {
      const response = await api.post(ENDPOINTS.BOOKS_WITH_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to create book with image';
    }
  },

  // Update book (LIBRARIAN only)
  updateBook: async (id, bookData) => {
    try {
      const response = await api.put(ENDPOINTS.BOOK_BY_ID(id), bookData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update book';
    }
  },

  // Update book with image (LIBRARIAN only)
  updateBookWithImage: async (id, formData) => {
    try {
      const response = await api.put(ENDPOINTS.UPDATE_BOOK_WITH_IMAGE(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update book with image';
    }
  },

  // Update book status (LIBRARIAN only)
  updateBookStatus: async (id, status) => {
    try {
      const response = await api.patch(ENDPOINTS.BOOK_STATUS(id), { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update book status';
    }
  },

  // Delete book (LIBRARIAN only)
  deleteBook: async (id) => {
    try {
      const response = await api.delete(ENDPOINTS.BOOK_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to delete book';
    }
  },
};

export default bookService;