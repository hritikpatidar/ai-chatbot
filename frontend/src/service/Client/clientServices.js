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
