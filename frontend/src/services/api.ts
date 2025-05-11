import axios from 'axios';

// Use environment variable or fallback to production URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dobsinskym.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Add request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Try to get CSRF token from multiple possible cookie names
    const csrfTokenMatches = [
      document.cookie.match(/csrf_access_token=([^;]+)/),
      document.cookie.match(/X-CSRF-TOKEN=([^;]+)/),
      document.cookie.match(/csrf_token=([^;]+)/)
    ];
    
    const csrfToken = csrfTokenMatches.find(match => match !== null)?.[1];
    
    if (csrfToken && config.headers) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Import notification functions if not at the top of the file
// NOTE: You'll need to uncomment this line or add it at the top of the file
// import { useNotification } from '../contexts/NotificationContext';
// If you can't use hooks here, consider creating a separate notification service

// Add response interceptor for refreshing token or handling auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle network errors or cases where response is undefined
    if (!error.response) {
      console.error('Network error or no response from server:', error);
      // We can't use hooks directly in interceptors, so we'll use console errors for now
      // A better solution would be to create a notification service outside of React components
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    
    // If error is 401 Unauthorized and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Check if we're making an auth-related request - don't try to refresh for these
      const isAuthRequest = originalRequest.url?.includes('/login') || 
                            originalRequest.url?.includes('/register') || 
                            originalRequest.url === '/auth-check';

      // Skip token refresh for auth requests and public endpoints
      if (isAuthRequest) {
        console.log('Auth request failed - not attempting refresh');
        return Promise.reject(error);
      }

      try {
        // Call refresh token endpoint - using GET since the backend expects GET
        // Include withCredentials to ensure cookies are sent
        const refreshResponse = await api.get('/refresh', { 
          withCredentials: true 
        });
        
        console.log('Token refresh successful', refreshResponse);
        
        // Retry the original request
        return api(originalRequest);
      } catch (error) {
        // Properly type the error for TypeScript
        const refreshError = error as Error & { 
          response?: { 
            status?: number,
            data?: any 
          } 
        };
        console.error('Token refresh failed:', refreshError);
        
        // Check for specific errors - but don't redirect for initial auth requests
        if (refreshError.response?.status === 401 && !isAuthRequest) {
          console.log('Session expired, redirecting to login');
          // If refresh fails due to auth, redirect to login with a return URL
          const currentPath = window.location.pathname;
          window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/login', { username, password });
    return response.data;
  },
  
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    telephone?: string;
  }) => {
    const response = await api.post('/register', userData);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },
  
  checkAuth: async () => {
    try {
      const response = await api.get('/auth-check');
      return response.data;
    } catch (error: any) {
      // Don't attempt token refresh during auth check - this avoids unnecessary
      // refresh attempts when user is not logged in
      console.error('Auth check error:', error);
      return null;
    }
  }
};

// Product services
export const productService = {
  getAllProducts: async (params?: { page?: number; per_page?: number; category_id?: string }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  
  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  searchProducts: async (query: string) => {
    const response = await api.get(`/products/search`, { params: { query } });
    return response.data;
  },
  
  getProductsByCategory: async (categoryId: string) => {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  }
};

// Category services
export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  }
};

// Cart services
export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: any; // Product details when loaded
}

// Order services
export const orderService = {
  createOrder: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  
  likeOrder: async (orderId: string) => {
    const response = await api.post(`/orders/${orderId}/like`);
    return response.data;
  },
  
  createCheckoutSession: async (items: { product_id: string; quantity: number }[]) => {
    const response = await api.post('/create-checkout-session', { items });
    return response.data;
  }
};

export default api;
