import httpServices from "../httpServices";

export const ChangePasswordService = (payload) => {
  return httpServices.post(`/profile/change-password`, payload);
};
export const profileUpdateService = (payload) => {
  return httpServices.put(`/profile/update-profile`, payload);
};
