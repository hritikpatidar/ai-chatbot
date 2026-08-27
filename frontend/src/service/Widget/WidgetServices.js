import httpServices from "../httpServices";

export const identifyWidgetUserService = async (data) => {
  return httpServices.post(`/widget/identify`, data);
};

export const verifyWidgetSessionService = (sessionToken) => {
  return httpServices.get("/widget/session/verify", {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });
};
