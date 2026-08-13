import httpServices from "../httpServices";

export const createFAQService = async (clientId, payload) => {
  return httpServices.post(`/faqs/client/${clientId}`, payload);
};

export const getFAQsService = async (clientId) => {
  return httpServices.get(`/faqs/client/${clientId}`);
};

export const updateFAQService = async (faqId, payload) => {
  return httpServices.patch(`/faqs/${faqId}`, payload);
};

export const deleteFAQService = async (faqId) => {
  return httpServices.delete(`/faqs/${faqId}`);
};
