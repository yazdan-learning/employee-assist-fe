// src/config/api.ts
export const API_CONFIG = {
  SERVICES: {
    ACCOUNTANT: {
      BASE_URL:
        process.env.REACT_APP_ACCOUNTANT_API_URL || 'https://localhost:7190/api',
      ENDPOINTS: {
        CUSTOMERS: '/contacts',
        PRODUCTS: '/products',
        PRODUCT_CATEGORIES: '/product-categories',
        PRODUCT_ATTRIBUTES: '/product-warehouses',
        PRODUCT_ATTRIBUTE_VALUES: '/ProductAttributeValue',
        PRODUCT_LOCATIONS: '/ProductLocation',
        PRODUCT_PRICES: '/product-prices',
        PRODUCT_SALE_TYPES: '/product-sale-types',
        PRODUCT_UNITS: '/product-units',
        PRODUCT_WAREHOUSES: '/product-warehouses',
        // add more endpoints as needed
      },
    },
    // ⬇️ simply copy-paste and adjust for each extra micro-service
    // ORDERS: { BASE_URL: '...', ENDPOINTS: { LIST: '/orders' } },
  },
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;
