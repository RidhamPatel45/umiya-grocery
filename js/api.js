// ── API Base ────────────────────────────────────────────
const API_BASE = 'http://localhost:3000/api';

async function apiCall(endpoint, method = 'GET', data = null) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  const token = localStorage.getItem('umiya_token');
  if (token) options.headers['Authorization'] = 'Bearer ' + token;
  if (data) options.body = JSON.stringify(data);
  try {
    const res = await fetch(API_BASE + endpoint, options);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Request failed');
    return { ok: true, data: json };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

const ProductAPI = {
  getAll: (category) => apiCall('/products' + (category ? '?category=' + category : '')),
  getAdmin: () => apiCall('/admin/products'),
  add: (data) => apiCall('/products', 'POST', data),
  update: (id, data) => apiCall('/products/' + id, 'PUT', data),
  delete: (id) => apiCall('/products/' + id, 'DELETE')
};

const AuthAPI = {
  login: (data) => apiCall('/login', 'POST', data),
  register: (data) => apiCall('/register', 'POST', data)
};

const OrderAPI = {
  save: (data) => apiCall('/orders', 'POST', data),
  getAll: () => apiCall('/orders'),
  updateStatus: (id, status) => apiCall('/orders/' + id + '/status', 'PUT', { status })
};

const StatsAPI = {
  get: () => apiCall('/admin/stats')
};
