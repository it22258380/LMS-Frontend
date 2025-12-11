import api from './api';
import { ENDPOINTS } from '../utils/constants';

const reservationService = {
  // Get all reservations
  getAllReservations: async () => {
    try {
      const response = await api.get(ENDPOINTS.RESERVATIONS);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch reservations';
    }
  },

  // Get reservation by ID
  getReservationById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.RESERVATION_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch reservation';
    }
  },

  // Create reservation
  createReservation: async (userId, bookId) => {
    try {
      const response = await api.post(ENDPOINTS.RESERVATIONS, null, {
        params: { userId, bookId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to create reservation';
    }
  },

  // Delete reservation
  deleteReservation: async (id) => {
    try {
      const response = await api.delete(ENDPOINTS.RESERVATION_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to delete reservation';
    }
  },
};

export default reservationService;