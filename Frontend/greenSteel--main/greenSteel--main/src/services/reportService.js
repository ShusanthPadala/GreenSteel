import api, { unwrapApiResponse } from './api';

export const reportService = {
  getAllReports: async () => {
    const response = await api.get('/reports');
    return unwrapApiResponse(response.data);
  },

  getReportById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return unwrapApiResponse(response.data);
  },

  createReport: async (data) => {
    const response = await api.post('/reports', data);
    return unwrapApiResponse(response.data);
  },

  updateReport: async (id, data) => {
    const response = await api.put(`/reports/${id}`, data);
    return unwrapApiResponse(response.data);
  },

  deleteReport: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return unwrapApiResponse(response.data);
  }
};
