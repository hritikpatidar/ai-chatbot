import httpServices from "../httpServices";

// Get client details
export const getClientByIdService = async (clientId) => {
  return httpServices.get(`/client/${clientId}`);
};

// Create client
export const createClientService = async (payload) => {
  return httpServices.post("/client", payload);
};

// Update client
export const updateClientService = async (clientId, payload) => {
  return httpServices.patch(`/client/${clientId}`, payload);
};

// Public client config
export const getClientConfig = async (clientKey) => {
  return httpServices.get(`/client/config/${clientKey}`);
};
