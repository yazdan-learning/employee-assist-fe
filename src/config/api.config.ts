export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://localhost:7190/api',
  ENDPOINTS: {
    CUSTOMERS: '/contacts',
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
}; 