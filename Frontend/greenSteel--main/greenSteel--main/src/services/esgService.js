import api, { unwrapApiResponse } from './api';

export const esgService = {
  getDashboard: async () => {
    const response = await api.get('/api/esg/dashboard');
    // Note: Backend returns raw ESGDashboardResponse, not ApiResponse
    return unwrapApiResponse(response.data);
  },

  getEnvironmentalMetrics: async () => {
    const response = await api.get('/api/esg/environment');
    return unwrapApiResponse(response.data);
  },

  getSocialMetrics: async () => {
    const response = await api.get('/api/esg/social');
    return unwrapApiResponse(response.data);
  },

  getGovernanceMetrics: async () => {
    const response = await api.get('/api/esg/governance');
    return unwrapApiResponse(response.data);
  },

  getEnvironmentalAlerts: async () => {
    const response = await api.get('/api/esg/environment-alerts');
    return unwrapApiResponse(response.data);
  }
};
