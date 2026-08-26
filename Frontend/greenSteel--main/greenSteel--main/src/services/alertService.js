import api, { unwrapApiResponse } from './api';

export const alertService = {
  getActiveAlerts: async () => {
    const response = await api.get('/alerts');
    return unwrapApiResponse(response.data);
  }
};
