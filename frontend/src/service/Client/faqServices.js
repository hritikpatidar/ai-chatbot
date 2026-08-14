import httpServices from "../httpServices";

export const createFAQService = async (clientId, payload) => {
  return httpServices.post(`/faqs/client/${clientId}`, payload);
};

export const getFAQsService = async (
  clientId,
  { page = 1, limit = 10, search = "" } = {},
) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  if (search?.trim()) {
    params.append("search", search.trim());
  }

  return httpServices.get(`/faqs/client/${clientId}?${params.toString()}`);
};

export const updateFAQService = async (faqId, payload) => {
  return httpServices.patch(`/faqs/${faqId}`, payload);
};

export const deleteFAQService = async (faqId) => {
  return httpServices.delete(`/faqs/${faqId}`);
};
