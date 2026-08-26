import api, { unwrapApiResponse } from './api';

export const emissionRecordService = {
  getAllEmissionRecords: async () => {
    const response = await api.get('/emission-records');
    return unwrapApiResponse(response.data);
  },

  getEmissionRecordById: async (id) => {
    const response = await api.get(`/emission-records/${id}`);
    return unwrapApiResponse(response.data);
  },

  getEmissionRecordsByUnit: async (unitId) => {
    const response = await api.get(`/emission-records/unit/${unitId}`);
    return unwrapApiResponse(response.data);
  },

  createEmissionRecord: async (data) => {
    const response = await api.post('/emission-records', data);
    return unwrapApiResponse(response.data);
  },

  updateEmissionRecord: async (id, data) => {
    const response = await api.put(`/emission-records/${id}`, data);
    return unwrapApiResponse(response.data);
  },

  deleteEmissionRecord: async (id) => {
    const response = await api.delete(`/emission-records/${id}`);
    return unwrapApiResponse(response.data);
  }
};
