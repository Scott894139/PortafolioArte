import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funciones auxiliares para diferentes tipos de requests
const apiRequest = async (method, url, data = null, config = {}) => {
  try {
    const response = await api({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`API Error (${method.toUpperCase()} ${url}):`, error);
    throw error;
  }
};

// Servicios para Gallery
export const galleryService = {
  // Obtener todas las obras
  getAll: (params = {}) => apiRequest('get', '/gallery', null, { params }),
  
  // Obtener obra específica
  getById: (id) => apiRequest('get', `/gallery/${id}`),
  
  // Obtener categorías
  getCategories: () => apiRequest('get', '/gallery/categories/list'),
  
  // Obtener tags populares
  getPopularTags: () => apiRequest('get', '/gallery/tags/popular'),
  
  // Crear obra (admin)
  create: (data) => apiRequest('post', '/gallery', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Actualizar obra (admin)
  update: (id, data) => apiRequest('put', `/gallery/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Eliminar obra (admin)
  delete: (id) => apiRequest('delete', `/gallery/${id}`),
};

// Servicios para Projects
export const projectService = {
  getAll: (params = {}) => apiRequest('get', '/projects', null, { params }),
  getById: (id) => apiRequest('get', `/projects/${id}`),
  getCategories: () => apiRequest('get', '/projects/categories/list'),
  create: (data) => apiRequest('post', '/projects', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => apiRequest('put', `/projects/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => apiRequest('delete', `/projects/${id}`),
};

// Servicios para Blog
export const blogService = {
  getAll: (params = {}) => apiRequest('get', '/blog', null, { params }),
  getBySlug: (slug) => apiRequest('get', `/blog/${slug}`),
  getRelated: (slug) => apiRequest('get', `/blog/${slug}/related`),
  getCategories: () => apiRequest('get', '/blog/categories/list'),
  like: (slug) => apiRequest('post', `/blog/${slug}/like`),
  create: (data) => apiRequest('post', '/blog', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => apiRequest('put', `/blog/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => apiRequest('delete', `/blog/${id}`),
};

// Servicios para Contact
export const contactService = {
  send: (data) => apiRequest('post', '/contact', data),
  getAll: (params = {}) => apiRequest('get', '/contact', null, { params }),
  getById: (id) => apiRequest('get', `/contact/${id}`),
  updateStatus: (id, data) => apiRequest('put', `/contact/${id}/status`, data),
  delete: (id) => apiRequest('delete', `/contact/${id}`),
};

// Servicios para Testimonials
export const testimonialService = {
  getAll: (params = {}) => apiRequest('get', '/testimonials', null, { params }),
  getById: (id) => apiRequest('get', `/testimonials/${id}`),
  create: (data) => apiRequest('post', '/testimonials', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAllAdmin: (params = {}) => apiRequest('get', '/testimonials/admin/all', null, { params }),
  update: (id, data) => apiRequest('put', `/testimonials/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  approve: (id, approved) => apiRequest('put', `/testimonials/${id}/approve`, { approved }),
  delete: (id) => apiRequest('delete', `/testimonials/${id}`),
};

// Servicios para Store
export const storeService = {
  getAll: (params = {}) => apiRequest('get', '/store', null, { params }),
  getById: (id) => apiRequest('get', `/store/${id}`),
  getCategories: () => apiRequest('get', '/store/categories/list'),
  create: (data) => apiRequest('post', '/store', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  createOrder: (data) => apiRequest('post', '/store/orders', data),
  processPayment: (data) => apiRequest('post', '/store/payment/stripe', data),
  getAllOrders: (params = {}) => apiRequest('get', '/store/orders/all', null, { params }),
  updateOrderStatus: (id, data) => apiRequest('put', `/store/orders/${id}/status`, data),
};

// Servicio para subir archivos
export const uploadService = {
  uploadImage: (file, folder = 'general') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    
    return apiRequest('post', '/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  uploadMultiple: (files, folder = 'general') => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('folder', folder);
    
    return apiRequest('post', '/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export default api; 