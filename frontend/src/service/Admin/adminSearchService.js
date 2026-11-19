import httpServices from "../httpServices";

export const searchAdminRecordsService = (query) => {
  const params = new URLSearchParams({ q: query });
  return httpServices.get(`/admin/search?${params.toString()}`);
};
