import httpServices from "../httpServices";

export const signupService = (userData) => {
  return httpServices.post(`/auth/signup`, userData);
};

export const resendOtpService = (data) => {
  return httpServices.post(`/auth/resend-otp`, data);
};

export const verifyOtpService = (data) => {
  return httpServices.post(`/auth/verify-email-otp`, data);
};

export const loginUserService = (data) => {
  return httpServices.post(`/auth/login`, data);
};

export const forgotPasswordService = (data) => {
  return httpServices.post(`/auth/forgot-password`, data);
};

export const resetPasswordService = (data) => {
  return httpServices.post(`/auth/reset-password`, data);
};

export const ChangePasswordService = (data) => {
  return httpServices.post("/auth/change-password", data);
};

export const logoutService = (data) => {
  return httpServices.post("/auth/logout", data);
};
