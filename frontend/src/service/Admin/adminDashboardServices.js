import httpServices from "../httpServices";

export const getAdminDashboardService = () => {
  return httpServices.get("/admin/dashboard");
};