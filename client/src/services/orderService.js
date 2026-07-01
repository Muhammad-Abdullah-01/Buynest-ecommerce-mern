import api from './api.js';

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get('/orders/myorders');
  return response.data;
};

export const updateOrderToPaid = async (id, paymentResult) => {
  const response = await api.put(`/orders/${id}/pay`, paymentResult);
  return response.data;
};

export const createPaymentIntent = async (amount) => {
  const response = await api.post('/orders/create-payment-intent', { amount });
  return response.data;
};

// Admin Services
export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard-stats');
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get('/admin/orders');
  return response.data;
};

export const deliverOrder = async (id) => {
  const response = await api.put(`/admin/orders/${id}/deliver`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const updateUserRole = async (id, userData) => {
  const response = await api.put(`/admin/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};
