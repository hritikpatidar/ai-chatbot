import httpServices from "../httpServices";

// Get Admin Analytics
export const getAdminAnalyticsService = async (range = 7) => {
    return httpServices.get(`/admin/analytics/?range=${range}`);
};