// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL ;

// User Roles
export const ROLES = {
  USER: 'USER',
  LIBRARIAN: 'LIBRARIAN'
};

// Book Status
export const BOOK_STATUS = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  UNDER_MAINTENANCE: 'UNDER_MAINTENANCE'
};

// Reservation Periods (in days)
export const RESERVATION_PERIODS = [
  { label: '7 Days', value: 7 },
  { label: '14 Days', value: 14 },
  { label: '21 Days', value: 21 }
];

// API Endpoints
export const ENDPOINTS = {
  // Auth
  SIGNUP: '/api/auth/signup',
  LOGIN: '/api/auth/login',
  USER_PROFILE: (id) => `/api/auth/${id}`,
  UPDATE_ROLE: (id) => `/api/auth/${id}/role`,
  TOGGLE_BLACKLIST: (id) => `/api/auth/${id}/blacklist`,
  
  // Books
  BOOKS: '/api/books',
  BOOK_BY_ID: (id) => `/api/books/${id}`,
  BOOKS_WITH_IMAGE: '/api/books/with-image',
  UPDATE_BOOK_WITH_IMAGE: (id) => `/api/books/${id}/with-image`,
  BOOK_STATUS: (id) => `/api/books/${id}/status`,
  BOOKS_BY_CATEGORY: (categoryId) => `/api/books/category/${categoryId}`,
  BOOKS_AVAILABLE: '/api/books/available',
  SEARCH_BY_TITLE: '/api/books/search/title',
  SEARCH_BY_AUTHOR: '/api/books/search/author',
  SEARCH_BY_GENRE: '/api/books/search/genre',
  
  // Categories
  CATEGORIES: '/api/categories',
  CATEGORY_BY_ID: (id) => `/api/categories/${id}`,
  
  // Reservations
  RESERVATIONS: '/api/reservations',
  RESERVATION_BY_ID: (id) => `/api/reservations/${id}`
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'library_token',
  USER: 'library_user'
};