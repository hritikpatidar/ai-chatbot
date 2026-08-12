import httpServices from "../httpServices";

// Create FAQ
export const createFAQService = async (clientId, payload) => {
  return httpServices.post(`/faqs/client/${clientId}`, payload);
};

// Get FAQs
export const getFAQsService = async (clientId) => {
  return httpServices.get(`/faqs/client/${clientId}`);
};

// Update FAQ
export const updateFAQService = async (faqId, payload) => {
  return httpServices.patch(`/faqs/${faqId}`, payload);
};

// Delete FAQ
export const deleteFAQService = async (faqId) => {
  return httpServices.delete(`/faqs/${faqId}`);
};
