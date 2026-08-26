import SubscriptionPlan from "../models/SubscriptionPlan.js";

/* =========================================================
   GET PLANS
========================================================= */

/**
 * Get all active subscription plans
 */
export const findActiveSubscriptionPlans = async () => {
  return await SubscriptionPlan.find({
    status: "active",
  })
    .sort({
      sortOrder: 1,
    })
    .lean();
};

/**
 * Get all plans
 *
 * Admin ke liye useful hoga.
 */
export const findAllSubscriptionPlans = async () => {
  return await SubscriptionPlan.find({})
    .sort({
      sortOrder: 1,
    })
    .lean();
};

/* =========================================================
   FIND PLAN
========================================================= */

/**
 * Find active plan by MongoDB ID
 */
export const findSubscriptionPlanById = async (planId) => {
  return await SubscriptionPlan.findOne({
    _id: planId,
  }).lean();
};

/**
 * Find plan by Stripe Price ID
 */
export const findSubscriptionPlanByStripePriceId = async (
  stripePriceId,
) => {
  return await SubscriptionPlan.findOne({
    stripePriceId,
    status: "active",
  }).lean();
};

/**
 * Find plan by Stripe Product ID
 */
export const findSubscriptionPlanByStripeProductId = async (
  stripeProductId,
) => {
  return await SubscriptionPlan.findOne({
    stripeProductId,
    status: "active",
  }).lean();
};

/* =========================================================
   ADMIN PLAN OPERATIONS
========================================================= */

/**
 * Create subscription plan
 */
export const createSubscriptionPlan = async (data) => {
  return await SubscriptionPlan.create(data);
};

/**
 * Update subscription plan
 */
export const updateSubscriptionPlan = async (
  planId,
  updateData,
) => {
  return await SubscriptionPlan.findByIdAndUpdate(
    planId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();
};

/**
 * Delete subscription plan
 */
export const deleteSubscriptionPlan = async (planId) => {
  return await SubscriptionPlan.findByIdAndDelete(planId);
};