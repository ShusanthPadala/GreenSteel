import api, { unwrapApiResponse } from './api';

export const alertService = {
  getActiveAlerts: async () => {
    const response = await api.get('/alerts');
    return unwrapApiResponse(response.data);
  },
  // Close an alert once its cause is dealt with
  resolveAlert: async (id) => {
    const response = await api.put(`/alerts/${id}/resolve`);
    return unwrapApiResponse(response.data);
  }
};
