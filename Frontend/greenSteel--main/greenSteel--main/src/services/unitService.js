import api, { unwrapApiResponse } from './api';

export const unitService = {
  getAllUnits: async () => {
    const response = await api.get('/units');
    return unwrapApiResponse(response.data);
  },

  getUnitById: async (id) => {
    const response = await api.get(`/units/${id}`);
    return unwrapApiResponse(response.data);
  },

  createUnit: async (data) => {
    const response = await api.post('/units', data);
    return unwrapApiResponse(response.data);
  },

  updateUnit: async (id, data) => {
    const response = await api.put(`/units/${id}`, data);
    return unwrapApiResponse(response.data);
  },

  deleteUnit: async (id) => {
    const response = await api.delete(`/units/${id}`);
    return unwrapApiResponse(response.data);
  }
};
