import api, { unwrapApiResponse } from './api';

export const getDepartments = async () => {
  const response = await api.get('/departments');
  return unwrapApiResponse(response.data);
};

export const getDepartmentById = async (id) => {
  const response = await api.get(`/departments/${id}`);
  return unwrapApiResponse(response.data);
};

export const createDepartment = async (data) => {
  const response = await api.post('/departments', data);
  return unwrapApiResponse(response.data);
};

export const updateDepartment = async (id, data) => {
  const response = await api.put(`/departments/${id}`, data);
  return unwrapApiResponse(response.data);
};

export const deleteDepartment = async (id) => {
  const response = await api.delete(`/departments/${id}`);
  return unwrapApiResponse(response.data);
};
