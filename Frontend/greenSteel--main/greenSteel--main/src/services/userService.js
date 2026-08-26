import api, { unwrapApiResponse } from './api';

export const userService = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return unwrapApiResponse(response.data);
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return unwrapApiResponse(response.data);
  },

  createUser: async (data) => {
    const response = await api.post('/users', data);
    return unwrapApiResponse(response.data);
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return unwrapApiResponse(response.data);
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return unwrapApiResponse(response.data);
  }
};
