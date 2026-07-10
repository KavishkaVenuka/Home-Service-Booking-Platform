import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hsp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login    = (data) => api.post('/auth/login', data);
export const getMe    = ()     => api.get('/auth/me');

// Workers
export const fetchWorkers           = (category) => api.get('/workers', { params: category ? { category } : {} });
export const fetchWorkerById        = (id)        => api.get(`/workers/${id}`);
export const fetchWorkerReviews     = (id)        => api.get(`/reviews/worker/${id}`);
export const fetchMyWorkerProfile   = ()          => api.get('/workers/me');
export const updateMyWorkerProfile  = (id, data)  => api.put(`/workers/${id}`, data);
export const createWorkerProfile    = (data)      => api.post('/workers', data);
export const fetchWorkerJobBookings = ()          => api.get('/bookings/worker');

// Bookings
export const createBooking      = (data) => api.post('/bookings', data);
export const fetchMyBookings    = ()     => api.get('/bookings/my');
export const updateBookingStatus = (id, status) => api.patch(`/bookings/${id}/status`, { status });

// Reviews
export const submitReview = (data) => api.post('/reviews', data);

export default api;
