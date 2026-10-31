import httpServices from "../httpServices";

export const getClientByIdService = async (clientId) => {

  return httpServices.get(`/client/${clientId}`);
};

export const createClientService = async (payload) => {
  return httpServices.post("/admin/create-client", payload);
};

export const updateClientService = async (clientId, payload) => {
  return httpServices.patch(`/client/${clientId}`, payload);
};

export const getClientConfig = async (clientKey) => {
  return httpServices.get(`/client/config/${clientKey}`);
};

export const getUsageAnalyticsService = async () => {
  return httpServices.get("/client/usage-analytics");
};

// Analytics
// service/Client/clientServices.js

export const getAnalyticsOverviewService = async (range = 7) => {
    return httpServices.get(`/client/analytics/overview?range=${range}`);
};

export const getConversationsChartService = async (range = 7, metric = "conversations") => {
    return httpServices.get(`/client/analytics/conversations?range=${range}&metric=${metric}`);
};

export const getUserActivityService = async (range = 7) => {
    return httpServices.get(`/client/analytics/user-activity?range=${range}`);
};

export const getConversationSourcesService = async (range = 7) => {
    return httpServices.get(`/client/analytics/sources?range=${range}`);
};

export const getPopularTopicsService = async (range = 7) => {
    return httpServices.get(`/client/analytics/topics?range=${range}`);
};

export const getUserSatisfactionService = async (range = 7) => {
    return httpServices.get(`/client/analytics/satisfaction?range=${range}`);
};