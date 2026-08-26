import {
  findSubscriptionByClientId,
  findSubscriptionByUserId,
  findSubscriptionById,
  findSubscriptionByStripeId,
  createSubscription,
  updateSubscriptionById,
  updateSubscriptionByStripeId,
} from "../repositories/subscription.repository.js";

import {
  findActiveSubscriptionPlans,
  findSubscriptionPlanById,
  findSubscriptionPlanByStripePriceId,
} from "../repositories/subscriptionPlan.repository.js";

import {
  createStripeCustomer,
  getStripeCustomer,
  createStripeSubscription,
  getStripeSubscription,
  changeStripeSubscriptionPlan,
  cancelStripeSubscription,
  cancelStripeSubscriptionAtPeriodEnd,
  resumeStripeSubscription,
  previewSubscriptionChange,
  getStripePaymentMethods,
  attachStripePaymentMethod,
  detachStripePaymentMethod,
  setDefaultStripePaymentMethod,
  getDefaultStripePaymentMethod,
  getStripeInvoice,
} from "./stripe.service.js";

/* =========================================================
   HELPERS
========================================================= */

/**
 * Convert Stripe unix timestamp into JS Date
 */
const stripeDate = (timestamp) => {
  if (!timestamp) {
    return null;
  }

  return new Date(timestamp * 1000);
};

/**
 * Get Stripe subscription status
 */
const getSubscriptionStatus = (stripeSubscription) => {
  return stripeSubscription?.status || "active";
};

/**
 * Prepare subscription DB data from Stripe subscription
 */
const buildSubscriptionData = ({
  stripeSubscription,
  clientId,
  userId,
  plan,
  stripeCustomerId,
}) => {
  const subscriptionItem = stripeSubscription?.items?.data?.[0];

  const stripePrice = subscriptionItem?.price;

  return {
    clientId,
    userId,

    planId: plan._id,

    stripeCustomerId,

    stripeSubscriptionId: stripeSubscription.id,

    stripePriceId: stripePrice?.id || plan.stripePriceId,

    status: getSubscriptionStatus(stripeSubscription),

    amount: stripePrice?.unit_amount ?? plan.amount,

    currency: stripePrice?.currency ?? plan.currency,

    interval: stripePrice?.recurring?.interval ?? plan.interval,

    currentPeriodStart: stripeDate(stripeSubscription.current_period_start),

    currentPeriodEnd: stripeDate(stripeSubscription.current_period_end),

    cancelAtPeriodEnd: Boolean(stripeSubscription.cancel_at_period_end),

    canceledAt: stripeDate(stripeSubscription.canceled_at),

    trialStart: stripeDate(stripeSubscription.trial_start),

    trialEnd: stripeDate(stripeSubscription.trial_end),
  };
};

/* =========================================================
   PLANS
========================================================= */

/**
 * Get active subscription plans
 */
export const getSubscriptionPlans = async () => {
  return await findActiveSubscriptionPlans();
};

/**
 * Get single active plan
 */
export const getSubscriptionPlan = async (planId) => {
  const plan = await findSubscriptionPlanById(planId);

  if (!plan) {
    throw new Error("Subscription plan not found");
  }

  return plan;
};

/* =========================================================
   CURRENT SUBSCRIPTION
========================================================= */

/**
 * Get client's current subscription
 */
export const getCurrentSubscription = async (clientId) => {
  return await findSubscriptionByClientId(clientId);
};

/**
 * Get user's current subscription
 */
export const getUserSubscription = async (userId) => {
  return await findSubscriptionByUserId(userId);
};

/**
 * Get subscription details
 */
export const getSubscriptionDetails = async (subscriptionId) => {
  console.log("subscriptionId service1", subscriptionId);
  const subscription = await findSubscriptionById(subscriptionId);

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  return subscription;
};

/* =========================================================
   CREATE SUBSCRIPTION
========================================================= */

/**
 * Create subscription
 *
 * Flow:
 *
 * Client
 *   ↓
 * Check existing subscription
 *   ↓
 * Find Plan
 *   ↓
 * Create Stripe Customer
 *   ↓
 * Create Stripe Subscription
 *   ↓
 * Save subscription in MongoDB
 */
export const createSubscriptionService = async ({
  clientId,
  userId,
  fullName,
  email,
  planId,
  paymentMethodId = null,
}) => {
  /* -------------------------------------------------------
     Check existing subscription
  ------------------------------------------------------- */

  const existingSubscription = await findSubscriptionByClientId(clientId);

  if (
    existingSubscription &&
    !["canceled", "incomplete_expired"].includes(existingSubscription.status)
  ) {
    const error = new Error("Client already has an active subscription");

    error.statusCode = 400;

    throw error;
  }

  /* -------------------------------------------------------
     Find plan
  ------------------------------------------------------- */

  const plan = await findSubscriptionPlanById(planId);

  if (!plan) {
    const error = new Error("Subscription plan not found");

    error.statusCode = 404;

    throw error;
  }

  /* -------------------------------------------------------
     Stripe Customer
  ------------------------------------------------------- */

  let stripeCustomer;

  /*
   * Future me Client model me stripeCustomerId
   * save kar sakte ho.
   *
   * Abhi new customer create kar rahe hain.
   */

  stripeCustomer = await createStripeCustomer({
    name: fullName,
    email,
    metadata: {
      clientId: String(clientId),
      userId: String(userId),
    },
  });

  /* -------------------------------------------------------
     Stripe Subscription
  ------------------------------------------------------- */

  const stripeSubscription = await createStripeSubscription({
    customerId: stripeCustomer.id,
    priceId: plan.stripePriceId,
    paymentMethodId,
    metadata: {
      clientId: String(clientId),
      userId: String(userId),
      planId: String(plan._id),
    },
  });

  /* -------------------------------------------------------
     Save in MongoDB
  ------------------------------------------------------- */

  const subscriptionData = buildSubscriptionData({
    stripeSubscription,
    clientId,
    userId,
    plan,
    stripeCustomerId: stripeCustomer.id,
  });

  const subscription = await createSubscription(subscriptionData);

  return {
    subscription,
    stripeCustomer: {
      id: stripeCustomer.id,
    },

    paymentIntent: stripeSubscription?.latest_invoice?.payment_intent || null,
  };
};

/* =========================================================
   SYNC SUBSCRIPTION
========================================================= */

/**
 * Sync MongoDB subscription with Stripe
 *
 * Webhook me bahut useful hoga.
 */
export const syncSubscriptionFromStripe = async (stripeSubscription) => {
  const existingSubscription = await findSubscriptionByStripeId(
    stripeSubscription.id,
  );

  if (!existingSubscription) {
    return null;
  }

  const plan = await findSubscriptionPlanByStripePriceId(
    stripeSubscription.items?.data?.[0]?.price?.id,
  );

  if (!plan) {
    throw new Error("Subscription plan not found for Stripe price");
  }

  const updateData = buildSubscriptionData({
    stripeSubscription,
    clientId:
      existingSubscription.clientId?._id || existingSubscription.clientId,
    userId: existingSubscription.userId,
    plan,
    stripeCustomerId: stripeSubscription.customer,
  });

  return await updateSubscriptionByStripeId(stripeSubscription.id, updateData);
};

/* =========================================================
   UPGRADE / DOWNGRADE
========================================================= */

/**
 * Change subscription plan
 *
 * This method supports both:
 *
 * Upgrade
 * Downgrade
 */
export const changeSubscriptionPlanService = async ({
  subscriptionId,
  planId,
}) => {
  /* -----------------------------------------------------
       Find local subscription
    ----------------------------------------------------- */
console.log("subscriptionId service2", subscriptionId);
  const currentSubscription = await findSubscriptionById(subscriptionId);

  if (!currentSubscription) {
    const error = new Error("Subscription not found");

    error.statusCode = 404;

    throw error;
  }

  /* -----------------------------------------------------
       Find new plan
    ----------------------------------------------------- */

  const newPlan = await findSubscriptionPlanById(planId);

  if (!newPlan) {
    const error = new Error("Subscription plan not found");

    error.statusCode = 404;

    throw error;
  }

  /* -----------------------------------------------------
       Already on same plan
    ----------------------------------------------------- */

  if (
    currentSubscription.planId?._id?.toString() === newPlan._id.toString() ||
    currentSubscription.stripePriceId === newPlan.stripePriceId
  ) {
    const error = new Error("You are already subscribed to this plan");

    error.statusCode = 400;

    throw error;
  }

  /* -----------------------------------------------------
       Stripe update
    ----------------------------------------------------- */

  const stripeSubscription = await changeStripeSubscriptionPlan({
    subscriptionId: currentSubscription.stripeSubscriptionId,

    priceId: newPlan.stripePriceId,

    prorationBehavior: "always_invoice",
  });

  /* -----------------------------------------------------
       Update MongoDB
    ----------------------------------------------------- */

  const updateData = buildSubscriptionData({
    stripeSubscription,
    clientId: currentSubscription.clientId?._id || currentSubscription.clientId,

    userId: currentSubscription.userId,

    plan: newPlan,

    stripeCustomerId: currentSubscription.stripeCustomerId,
  });

  const updatedSubscription = await updateSubscriptionById(
    subscriptionId,
    updateData,
  );

  return {
    subscription: updatedSubscription,

    stripeSubscription,

    invoice: stripeSubscription?.latest_invoice || null,

    paymentIntent: stripeSubscription?.latest_invoice?.payment_intent || null,
  };
};

/* =========================================================
   PREVIEW UPGRADE
========================================================= */

/**
 * Preview subscription plan change
 *
 * Frontend ko charge amount dikhane ke liye.
 */
export const previewSubscriptionChangeService = async ({
  subscriptionId,
  planId,
}) => {
  /* -----------------------------------------------------
       Current subscription
    ----------------------------------------------------- */
console.log("subscriptionId service3", subscriptionId);
  const currentSubscription = await findSubscriptionById(subscriptionId);

  if (!currentSubscription) {
    const error = new Error("Subscription not found");

    error.statusCode = 404;

    throw error;
  }

  /* -----------------------------------------------------
       New plan
    ----------------------------------------------------- */

  const newPlan = await findSubscriptionPlanById(planId);

  if (!newPlan) {
    const error = new Error("Subscription plan not found");

    error.statusCode = 404;

    throw error;
  }

  /* -----------------------------------------------------
       Stripe Preview
    ----------------------------------------------------- */

  const invoice = await previewSubscriptionChange({
    customerId: currentSubscription.stripeCustomerId,

    subscriptionId: currentSubscription.stripeSubscriptionId,

    priceId: newPlan.stripePriceId,
  });

  return {
    subscriptionId,

    currentPlan: currentSubscription.planId,

    newPlan,

    invoice: {
      id: invoice.id,

      subtotal: invoice.subtotal,

      total: invoice.total,

      amountDue: invoice.amount_due,

      currency: invoice.currency,

      periodStart: stripeDate(invoice.period_start),

      periodEnd: stripeDate(invoice.period_end),
    },

    amountDue: invoice.amount_due,

    currency: invoice.currency,
  };
};

/* =========================================================
   CANCEL
========================================================= */

/**
 * Cancel subscription immediately
 */
export const cancelSubscriptionService = async (subscriptionId) => {
  console.log("subscriptionId service4", subscriptionId);
  const subscription = await findSubscriptionById(subscriptionId);

  if (!subscription) {
    const error = new Error("Subscription not found");

    error.statusCode = 404;

    throw error;
  }

  const stripeSubscription = await cancelStripeSubscription(
    subscription.stripeSubscriptionId,
  );

  const updatedSubscription = await updateSubscriptionById(subscriptionId, {
    status: stripeSubscription.status,

    cancelAtPeriodEnd: false,

    canceledAt: stripeDate(stripeSubscription.canceled_at),
  });

  return updatedSubscription;
};

/**
 * Cancel subscription at period end
 */
export const cancelSubscriptionAtPeriodEndService = async (subscriptionId) => {
  console.log("subscriptionId service5", subscriptionId);
  const subscription = await findSubscriptionById(subscriptionId);

  if (!subscription) {
    const error = new Error("Subscription not found");

    error.statusCode = 404;

    throw error;
  }

  const stripeSubscription = await cancelStripeSubscriptionAtPeriodEnd(
    subscription.stripeSubscriptionId,
  );

  return await updateSubscriptionById(subscriptionId, {
    status: stripeSubscription.status,

    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
  });
};

/* =========================================================
   RESUME
========================================================= */

/**
 * Resume subscription which was scheduled
 * for cancellation.
 */
export const resumeSubscriptionService = async (subscriptionId) => {
  console.log("subscriptionId service6", subscriptionId);
  const subscription = await findSubscriptionById(subscriptionId);

  if (!subscription) {
    const error = new Error("Subscription not found");

    error.statusCode = 404;

    throw error;
  }

  const stripeSubscription = await resumeStripeSubscription(
    subscription.stripeSubscriptionId,
  );

  return await updateSubscriptionById(subscriptionId, {
    status: stripeSubscription.status,

    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,

    canceledAt: null,
  });
};

/* =========================================================
   PAYMENT METHODS
========================================================= */

/**
 * Get customer's saved cards
 */
export const getPaymentMethodsService = async (subscriptionId) => {
  console.log("subscriptionId service7", subscriptionId);
  const subscription = await findSubscriptionById(subscriptionId);

  if (!subscription) {
    const error = new Error("Subscription not found");

    error.statusCode = 404;

    throw error;
  }

  const paymentMethods = await getStripePaymentMethods(
    subscription.stripeCustomerId,
  );

  const defaultPaymentMethod = await getDefaultStripePaymentMethod(
    subscription.stripeCustomerId,
  );

  return {
    paymentMethods: paymentMethods.data,

    defaultPaymentMethod,
  };
};

/**
 * Add payment method
 */
export const addPaymentMethodService = async ({
  subscriptionId,
  paymentMethodId,
}) => {
  console.log("subscriptionId service8", subscriptionId);
  const subscription = await findSubscriptionById(subscriptionId);

  if (!subscription) {
    const error = new Error("Subscription not found");

    error.statusCode = 404;

    throw error;
  }

  const paymentMethod = await attachStripePaymentMethod({
    customerId: subscription.stripeCustomerId,

    paymentMethodId,
  });

  return paymentMethod;
};

/**
 * Set default payment method
 */
export const setDefaultPaymentMethodService = async ({
  subscriptionId,
  paymentMethodId,
}) => {
  console.log("subscriptionId service9", subscriptionId);
  const subscription = await findSubscriptionById(subscriptionId);

  if (!subscription) {
    const error = new Error("Subscription not found");

    error.statusCode = 404;

    throw error;
  }

  return await setDefaultStripePaymentMethod({
    customerId: subscription.stripeCustomerId,

    paymentMethodId,
  });
};

/**
 * Remove payment method
 */
export const removePaymentMethodService = async ({
  subscriptionId,
  paymentMethodId,
}) => {
  console.log("subscriptionId service10", subscriptionId);
  const subscription = await findSubscriptionById(subscriptionId);

  if (!subscription) {
    const error = new Error("Subscription not found");

    error.statusCode = 404;

    throw error;
  }

  return await detachStripePaymentMethod(paymentMethodId);
};

/* =========================================================
   STRIPE REFRESH
========================================================= */

/**
 * Get latest Stripe subscription and update DB
 */
export const refreshSubscriptionService = async (subscriptionId) => {
  console.log("subscriptionId service11", subscriptionId);
  const subscription = await findSubscriptionById(subscriptionId);

  if (!subscription) {
    const error = new Error("Subscription not found");

    error.statusCode = 404;

    throw error;
  }

  const stripeSubscription = await getStripeSubscription(
    subscription.stripeSubscriptionId,
  );

  const plan = await findSubscriptionPlanByStripePriceId(
    stripeSubscription.items?.data?.[0]?.price?.id,
  );

  if (!plan) {
    throw new Error("Subscription plan not found");
  }

  const updateData = buildSubscriptionData({
    stripeSubscription,

    clientId: subscription.clientId?._id || subscription.clientId,

    userId: subscription.userId,

    plan,

    stripeCustomerId: subscription.stripeCustomerId,
  });

  return await updateSubscriptionById(subscriptionId, updateData);
};
