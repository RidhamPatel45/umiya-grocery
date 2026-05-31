import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const { data } = await api.post('/auth/refresh', { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      }
    }
    return Promise.reject(err);
  }
);

// API functions
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const productApi = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  addReview: (id: string, data: any) => api.post(`/products/${id}/reviews`, data),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
};

export const cartApi = {
  get: () => api.get('/cart'),
  add: (productId: string, quantity: number) => api.post('/cart', { productId, quantity }),
  update: (itemId: string, quantity: number) => api.put(`/cart/${itemId}`, { quantity }),
  clear: () => api.delete('/cart'),
};

export const orderApi = {
  create: (data: any) => api.post('/orders', data),
  verifyPayment: (data: any) => api.post('/orders/verify-payment', data),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
};

export const adminApi = {
  getDashboard: () => api.get('/orders/metrics'),
  getOrders: () => api.get('/orders/admin'),
  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/orders/admin/${id}/status`, { orderStatus: status }),
  getUsers: () => api.get('/admin/users'),
};

export default api;
