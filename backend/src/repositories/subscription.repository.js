import Subscription from "../models/Subscription.js";

/* =========================================================
   FIND SUBSCRIPTION
========================================================= */

/**
 * Find subscription by Client ID
 */
export const findSubscriptionByClientId = async (clientId) => {
  return await Subscription.findOne({
    clientId,
  })
    .populate("planId")
    .populate("clientId")
    .lean();
};

/**
 * Find subscription by User ID
 */
export const findSubscriptionByUserId = async (userId) => {
  return await Subscription.findOne({
    userId,
  })
    .populate("planId")
    .populate("clientId")
    .lean();
};

/**
 * Find subscription by MongoDB ID
 */
export const findSubscriptionById = async (subscriptionId) => {
  console.log("subscriptionIds repo", subscriptionId);
  return await Subscription.findById(subscriptionId)
    .populate("planId")
    .populate("clientId")
    .lean();
};

/**
 * Find subscription by Stripe Subscription ID
 */
export const findSubscriptionByStripeId = async (stripeSubscriptionId) => {
  return await Subscription.findOne({
    stripeSubscriptionId,
  })
    .populate("planId")
    .populate("clientId")
    .lean();
};

/* =========================================================
   CREATE
========================================================= */

/**
 * Create new subscription
 */
export const createSubscription = async (data) => {
  const subscription = await Subscription.create(data);

  return await Subscription.findById(subscription._id)
    .populate("planId")
    .populate("clientId")
    .lean();
};

/* =========================================================
   UPDATE
========================================================= */

/**
 * Update subscription by MongoDB ID
 */
export const updateSubscriptionById = async (subscriptionId, updateData) => {
  return await Subscription.findByIdAndUpdate(
    subscriptionId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("planId")
    .populate("clientId")
    .lean();
};

/**
 * Update subscription by Stripe Subscription ID
 */
export const updateSubscriptionByStripeId = async (
  stripeSubscriptionId,
  updateData,
) => {
  return await Subscription.findOneAndUpdate(
    {
      stripeSubscriptionId,
    },
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("planId")
    .populate("clientId")
    .lean();
};

/* =========================================================
   DELETE
========================================================= */

/**
 * Delete subscription by MongoDB ID
 */
export const deleteSubscriptionById = async (subscriptionId) => {
  return await Subscription.findByIdAndDelete(subscriptionId);
};

/* =========================================================
   CHECK
========================================================= */

/**
 * Check whether client already has a subscription
 */
export const hasSubscription = async (clientId) => {
  const subscription = await Subscription.exists({
    clientId,
  });

  return Boolean(subscription);
};
