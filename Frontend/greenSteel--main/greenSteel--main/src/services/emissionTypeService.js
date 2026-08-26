import api, { unwrapApiResponse } from './api';

export const emissionTypeService = {
  getAllEmissionTypes: async () => {
    const response = await api.get('/emission-types');
    return unwrapApiResponse(response.data);
  },

  getEmissionTypeById: async (id) => {
    const response = await api.get(`/emission-types/${id}`);
    return unwrapApiResponse(response.data);
  },

  createEmissionType: async (data) => {
    const response = await api.post('/emission-types', data);
    return unwrapApiResponse(response.data);
  },

  updateEmissionType: async (id, data) => {
    const response = await api.put(`/emission-types/${id}`, data);
    return unwrapApiResponse(response.data);
  },

  deleteEmissionType: async (id) => {
    const response = await api.delete(`/emission-types/${id}`);
    return unwrapApiResponse(response.data);
  }
};
