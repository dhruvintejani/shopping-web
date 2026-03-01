// API Configuration
// @ts-expect-error - Vite env types
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: { field: string; message: string }[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Include cookies for auth
  };

  try {
    const response = await fetch(url, config);

    // Try to parse JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      throw new ApiError(
        data?.message || 'Request failed',
        response.status,
        data?.errors
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network error
    throw new ApiError('Network error. Please check your connection.', 0);
  }
}

// HTTP methods
export const api = {
  get: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: 'GET' }),
  
  post: <T>(endpoint: string, data?: unknown) =>
    fetchApi<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  patch: <T>(endpoint: string, data?: unknown) =>
    fetchApi<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: 'DELETE' }),
};

// ============ AUTH API ============
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ message: string; user: User; accessToken: string }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ message: string; user: User; accessToken: string }>('/auth/login', data),

  logout: () => api.post<{ message: string }>('/auth/logout'),

  refresh: () => api.post<{ message: string; accessToken: string }>('/auth/refresh'),

  me: () => api.get<{ user: User }>('/auth/me'),

  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.patch<{ message: string; user: User }>('/auth/profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch<{ message: string }>('/auth/password', data),
};

// ============ PRODUCTS API ============
export const productsApi = {
  getProducts: (params?: Record<string, string | number | boolean>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return api.get<ProductsResponse>(`/products${query ? `?${query}` : ''}`);
  },

  getProduct: (id: string) => api.get<{ product: Product }>(`/products/${id}`),

  search: (q: string, params?: Record<string, string | number>) => {
    const searchParams = new URLSearchParams({ q, ...params as Record<string, string> });
    return api.get<ProductsResponse>(`/products/search?${searchParams}`);
  },

  getSuggestions: (q: string) =>
    api.get<{ suggestions: SearchSuggestion[] }>(`/products/suggestions?q=${encodeURIComponent(q)}`),

  getDeals: (limit = 8) => api.get<{ products: Product[] }>(`/products/deals?limit=${limit}`),

  getBestsellers: (limit = 8) => api.get<{ products: Product[] }>(`/products/bestsellers?limit=${limit}`),

  getRelated: (id: string, limit = 4) =>
    api.get<{ products: Product[] }>(`/products/${id}/related?limit=${limit}`),

  getCategories: () => api.get<{ categories: { name: string; count: number }[] }>('/products/categories'),

  getBrands: () => api.get<{ brands: string[] }>('/products/brands'),

  // Admin endpoints
  create: (data: Partial<Product>) => api.post<{ message: string; product: Product }>('/products', data),

  update: (id: string, data: Partial<Product>) =>
    api.patch<{ message: string; product: Product }>(`/products/${id}`, data),

  delete: (id: string) => api.delete<{ message: string }>(`/products/${id}`),
};

// ============ CART API ============
export const cartApi = {
  get: () => api.get<{ cart: CartResponse }>('/cart'),

  addItem: (productId: string, quantity = 1) =>
    api.post<{ message: string; cart: CartResponse }>('/cart', { productId, quantity }),

  updateQuantity: (productId: string, quantity: number) =>
    api.patch<{ message: string; cart: CartResponse }>(`/cart/${productId}`, { quantity }),

  removeItem: (productId: string) =>
    api.delete<{ message: string; cart: CartResponse }>(`/cart/${productId}`),

  clear: () => api.delete<{ message: string; cart: CartResponse }>('/cart'),
};

// ============ ORDERS API ============
export const ordersApi = {
  getOrders: (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const query = searchParams.toString();
    return api.get<OrdersResponse>(`/orders${query ? `?${query}` : ''}`);
  },

  getOrder: (id: string) => api.get<{ order: Order }>(`/orders/${id}`),

  create: (data: CreateOrderData) =>
    api.post<{ message: string; order: Order }>('/orders', data),

  cancel: (id: string) => api.patch<{ message: string; order: Order }>(`/orders/${id}/cancel`),

  // Admin endpoint
  updateStatus: (id: string, data: { status: string; trackingNumber?: string }) =>
    api.patch<{ message: string; order: Order }>(`/orders/${id}/status`, data),
};

// ============ WISHLIST API ============
export const wishlistApi = {
  get: () => api.get<{ wishlist: WishlistResponse }>('/wishlist'),

  add: (productId: string) =>
    api.post<{ message: string; wishlist: WishlistResponse }>('/wishlist', { productId }),

  toggle: (productId: string) =>
    api.post<{ message: string; added: boolean; wishlist: WishlistResponse }>('/wishlist/toggle', { productId }),

  remove: (productId: string) =>
    api.delete<{ message: string; wishlist: WishlistResponse }>(`/wishlist/${productId}`),

  clear: () => api.delete<{ message: string; wishlist: WishlistResponse }>('/wishlist'),

  check: (productId: string) => api.get<{ isInWishlist: boolean }>(`/wishlist/check/${productId}`),
};

// ============ TYPES ============
interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
}

interface Product {
  _id: string;
  id?: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  category: string;
  brand: string;
  stock: number;
  badge?: 'bestseller' | 'deal' | 'new' | 'limited';
  tags: string[];
  specifications: Record<string, string>;
  createdAt: string;
}

interface SearchSuggestion {
  id: string;
  title: string;
  category: string;
  image: string;
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

interface CartResponse {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface Order {
  _id: string;
  id?: string;
  orderNumber: string;
  items: {
    product: Product;
    title: string;
    image: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CreateOrderData {
  shippingAddress: ShippingAddress;
  paymentMethod?: string;
  notes?: string;
}

interface WishlistResponse {
  products: Product[];
  count: number;
}

// Export types
export type {
  User,
  Product,
  SearchSuggestion,
  ProductsResponse,
  CartItem,
  CartResponse,
  ShippingAddress,
  Order,
  OrdersResponse,
  CreateOrderData,
  WishlistResponse,
};
