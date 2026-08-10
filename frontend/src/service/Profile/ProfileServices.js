import httpServices from "../httpServices";

export const ChangePasswordService = (payload) => {
  return httpServices.post(`/profile/change-password`, payload);
};
