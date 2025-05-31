export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  ENDPOINTS: {
    CUSTOMERS: '/customers',
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
}; 