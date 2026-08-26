import api, { unwrapApiResponse } from './api';

export const roleService = {
  getAllRoles: async () => {
    const response = await api.get('/roles');
    return unwrapApiResponse(response.data);
  },

  getRoleById: async (id) => {
    const response = await api.get(`/roles/${id}`);
    return unwrapApiResponse(response.data);
  },

  addRole: async (data) => {
    const response = await api.post('/roles', data);
    return unwrapApiResponse(response.data);
  },

  updateRole: async (id, data) => {
    const response = await api.put(`/roles/${id}`, data);
    return unwrapApiResponse(response.data);
  },

  deleteRole: async (id) => {
    const response = await api.delete(`/roles/${id}`);
    return unwrapApiResponse(response.data);
  }
};
