import {
  findAllSubscriptionPlans,
  findSubscriptionPlanById,
  findSubscriptionPlanByStripePriceId,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "../repositories/subscriptionPlan.repository.js";

/* =========================================================
   CREATE PLAN
========================================================= */

export const createSubscriptionPlanService = async ({
  name,
  description = "",
  stripePriceId,
  stripeProductId,
  amount,
  currency = "gbp",
  interval = "month",
  features = [],
  sortOrder = 0,
  status = "active",
}) => {
  /* -------------------------------------------------------
     Check duplicate Stripe Price ID
  ------------------------------------------------------- */

  const existingPlan =
    await findSubscriptionPlanByStripePriceId(
      stripePriceId,
    );

  if (existingPlan) {
    const error = new Error(
      "Subscription plan with this Stripe Price ID already exists",
    );

    error.statusCode = 400;

    throw error;
  }

  /* -------------------------------------------------------
     Create plan
  ------------------------------------------------------- */

  const plan = await createSubscriptionPlan({
    name,
    description,
    stripePriceId,
    stripeProductId,
    amount,
    currency,
    interval,
    features,
    sortOrder,
    status,
  });

  return plan;
};

/* =========================================================
   GET ALL PLANS
========================================================= */

export const getAllSubscriptionPlansService = async () => {
  return await findAllSubscriptionPlans();
};

/* =========================================================
   GET SINGLE PLAN
========================================================= */

export const getAdminSubscriptionPlanService = async (
  planId,
) => {
  const plan =
    await findSubscriptionPlanById(planId);

  /*
   * findSubscriptionPlanById currently only returns
   * active plans because repository has:
   *
   * status: "active"
   *
   * For admin, we should ideally be able to
   * fetch inactive plans also.
   */

  if (!plan) {
    const error = new Error(
      "Subscription plan not found",
    );

    error.statusCode = 404;

    throw error;
  }

  return plan;
};

/* =========================================================
   UPDATE PLAN
========================================================= */

export const updateSubscriptionPlanService = async (
  planId,
  updateData,
) => {
  /* -------------------------------------------------------
     Check existing plan
  ------------------------------------------------------- */

  const existingPlan =
    await findSubscriptionPlanById(planId);

  if (!existingPlan) {
    const error = new Error(
      "Subscription plan not found",
    );

    error.statusCode = 404;

    throw error;
  }

  /* -------------------------------------------------------
     If Stripe Price ID changing,
     check duplicate
  ------------------------------------------------------- */

  if (
    updateData.stripePriceId &&
    updateData.stripePriceId !==
      existingPlan.stripePriceId
  ) {
    const duplicatePlan =
      await findSubscriptionPlanByStripePriceId(
        updateData.stripePriceId,
      );

    if (
      duplicatePlan &&
      duplicatePlan._id.toString() !==
        planId.toString()
    ) {
      const error = new Error(
        "Another subscription plan already uses this Stripe Price ID",
      );

      error.statusCode = 400;

      throw error;
    }
  }

  /* -------------------------------------------------------
     Update
  ------------------------------------------------------- */

  const updatedPlan =
    await updateSubscriptionPlan(
      planId,
      updateData,
    );

  if (!updatedPlan) {
    const error = new Error(
      "Failed to update subscription plan",
    );

    error.statusCode = 500;

    throw error;
  }

  return updatedPlan;
};

/* =========================================================
   DELETE PLAN
========================================================= */

export const deleteSubscriptionPlanService =
  async (planId) => {
    /* -------------------------------------------------------
       Check plan
    ------------------------------------------------------- */

    const existingPlan =
      await findSubscriptionPlanById(planId);

    if (!existingPlan) {
      const error = new Error(
        "Subscription plan not found",
      );

      error.statusCode = 404;

      throw error;
    }

    /* -------------------------------------------------------
       Delete
    ------------------------------------------------------- */

    const deletedPlan =
      await deleteSubscriptionPlan(planId);

    return deletedPlan;
  };