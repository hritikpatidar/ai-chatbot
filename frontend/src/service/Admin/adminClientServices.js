import httpServices from "../httpServices";

export const getAdminClientsService = async ({
  page = 1,
  limit = 12,
  search = "",
  status = "",
} = {}) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  params.append("status", status);

  if (search?.trim()) {
    params.append("search", search.trim());
  }

  return httpServices.get(`/admin/clients?${params.toString()}`);
};

export const getAdminClientDetailsService = async (clientId) => {
  return httpServices.get(`/admin/clients/${clientId}`);
};

export const deleteAdminClientService = async (clientId) => {
  return httpServices.delete(`/admin/delete-client/${clientId}`);
};

export const updateAdminClientService = (clientId, payload) => {
  return httpServices.put(`/admin/clients/${clientId}`, payload);
};
