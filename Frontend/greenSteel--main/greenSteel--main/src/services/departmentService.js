import api from "./api";

const BASE_URL = "/departments";

export const getDepartments = async () => {
    const response = await api.get(BASE_URL);
    return response.data.data;
};

export const getDepartmentById = async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data.data;
};

export const createDepartment = async (department) => {
    const response = await api.post(BASE_URL, department);
    return response.data.data;
};

export const updateDepartment = async (id, department) => {
    const response = await api.put(`${BASE_URL}/${id}`, department);
    return response.data.data;
};

export const deleteDepartment = async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data.message;
};