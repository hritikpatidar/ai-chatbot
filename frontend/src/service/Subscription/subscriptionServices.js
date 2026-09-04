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
   PAYMENT METHODS
========================================================= */

export const getPaymentMethodsApi = async () => {
  return httpServices.get("/subscription/payment-methods");
};

/* =========================================================
   ADD PAYMENT METHOD
========================================================= */

export const addPaymentMethodApi = async (payload) => {
  return httpServices.post("/subscription/payment-methods", payload);
};

/* =========================================================
   SET DEFAULT PAYMENT METHOD
========================================================= */

export const setDefaultPaymentMethodApi = async (paymentMethodId) => {
  return httpServices.patch(
    `/subscription/payment-method/${paymentMethodId}/default`,
  );
};

/* =========================================================
   REMOVE PAYMENT METHOD
========================================================= */

export const removePaymentMethodApi = async (paymentMethodId) => {
  return httpServices.delete(`/subscription/payment-method/${paymentMethodId}`);
};

/* =========================================================
   REFRESH SUBSCRIPTION
========================================================= */

export const refreshSubscriptionApi = async (subscriptionId) => {
  return httpServices.post("/subscription/refresh", {
    subscriptionId,
  });
};
