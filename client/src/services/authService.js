import api, { setAccessToken } from './api.js';

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data?.accessToken) {
    setAccessToken(response.data.accessToken);
  }
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data?.accessToken) {
    setAccessToken(response.data.accessToken);
  }
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  setAccessToken('');
  return response.data;
};

export const refresh = async () => {
  const response = await api.post('/auth/refresh-token');
  if (response.data?.accessToken) {
    setAccessToken(response.data.accessToken);
  }
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.put(`/auth/reset-password/${token}`, { password });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/auth/profile', profileData);
  return response.data;
};

export const getWishlist = async () => {
  const response = await api.get('/auth/wishlist');
  return response.data;
};

export const toggleWishlist = async (productId) => {
  const response = await api.post('/auth/wishlist', { productId });
  return response.data;
};
