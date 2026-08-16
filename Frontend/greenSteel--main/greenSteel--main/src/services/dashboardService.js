import api from "./api";

const getSummary = async () => {

    const response = await api.get("/dashboard/summary");

    return response.data;

};

const getTrends = async () => {

    const response = await api.get("/dashboard/trends");

    return response.data.data;

};

const dashboardService = {

    getSummary,
    getTrends,

};

export default dashboardService;