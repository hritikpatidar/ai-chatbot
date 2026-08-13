import httpServices from "../httpServices";

export const getClientByIdService = async (clientId) => {
  return httpServices.get(`/client/${clientId}`);
};

export const createClientService = async (payload) => {
  return httpServices.post("/client", payload);
};

export const updateClientService = async (clientId, payload) => {
  return httpServices.patch(`/client/${clientId}`, payload);
};

export const getClientConfig = async (clientKey) => {
  return httpServices.get(`/client/config/${clientKey}`);
};
