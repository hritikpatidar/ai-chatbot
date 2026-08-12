import httpServices from "../httpServices";

export const profileUpdateService = (payload) => {
  return httpServices.put(`/profile/update-profile`, payload);
};
