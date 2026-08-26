import httpServices from "../httpServices";

export const getSubscriptionPlansApi = async () => {
  return httpServices.get(`/admin/subscription-plans`);
};

/* =========================================================
   GET SINGLE SUBSCRIPTION PLAN
========================================================= */

export const getSubscriptionPlanApi = async (planId) => {
  return httpServices.get(`/admin/subscription-plans/${planId}`);
};

/* =========================================================
   CREATE SUBSCRIPTION PLAN
========================================================= */

export const createSubscriptionPlanApi = async (payload) => {
  return httpServices.post(`/admin/subscription-plans`, payload);
};

/* =========================================================
   UPDATE SUBSCRIPTION PLAN
========================================================= */

export const updateSubscriptionPlanApi = async ({ planId, payload }) => {
  return httpServices.patch(`/admin/subscription-plans/${planId}`, payload);
};

/* =========================================================
   DELETE SUBSCRIPTION PLAN
========================================================= */

export const deleteSubscriptionPlanApi = async (planId) => {
  return httpServices.delete(`/admin/subscription-plans/${planId}`);
};
