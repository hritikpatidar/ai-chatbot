import httpServices from "../httpServices";

/* =========================================================
   GET ACTIVE PLANS
========================================================= */

export const getSubscriptionPlansApi = async () => {
  return httpServices.get("/subscription/plans");
};

/* =========================================================
   GET CURRENT SUBSCRIPTION
========================================================= */

export const getCurrentSubscriptionApi = async () => {
  return httpServices.get("/subscription/current");
};

/* =========================================================
   GET USER CURRENT SUBSCRIPTION
========================================================= */

export const getUserCurrentSubscriptionApi = async () => {
  return httpServices.get("/subscription/user/current");
};

/* =========================================================
   GET SUBSCRIPTION DETAILS
========================================================= */

export const getSubscriptionDetailsApi = async (subscriptionId) => {
  return httpServices.get(`/subscription/${subscriptionId}`);
};

/* =========================================================
   CREATE SUBSCRIPTION
========================================================= */

export const createSubscriptionApi = async (payload) => {
  return httpServices.post("/subscription/create", payload);
};

/* =========================================================
   PREVIEW SUBSCRIPTION
========================================================= */

export const previewSubscriptionApi = async (payload) => {
  return httpServices.post("/subscription/preview", payload);
};

/* =========================================================
   CHANGE PLAN
========================================================= */

export const changeSubscriptionPlanApi = async (payload) => {
  return httpServices.post("/subscription/change-plan", payload);
};

/* =========================================================
   CANCLE SUBSCRIPTION
========================================================= */

export const cancleSubscriptionApi = async (subscriptionId) => {
  return httpServices.post("/subscription/cancel", {
    subscriptionId,
  });
};

/* =========================================================
   REFRESH SUBSCRIPTION
========================================================= */

export const refreshSubscriptionApi = async (subscriptionId) => {
  return httpServices.post("/subscription/refresh", {
    subscriptionId,
  });
};
