import api, { unwrapApiResponse } from "./api";

const getSummary = async () => {

    const response = await api.get("/dashboard/summary");

    return response.data;

};

const getTrends = async () => {

    const response = await api.get("/dashboard/trends");

    return response.data.data;

};

// Department drill-down: units, efficiency and health for one department
const getDepartmentDashboard = async (departmentId) => {

    const response = await api.get(`/dashboard/${departmentId}`);

    return unwrapApiResponse(response.data);

};

const dashboardService = {

    getSummary,
    getTrends,
    getDepartmentDashboard,

};

export default dashboardService;