import httpServices from "../httpServices";

export const getClientConfig = async (clientKey) => {
  return httpServices.get(`/client/config/${clientKey}`);
};
