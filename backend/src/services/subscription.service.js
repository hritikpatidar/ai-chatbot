import { extractSubscriptionPaymentData } from "../helpers/stripePayment.js";
import { findClientById, updateClient } from "../repositories/client.repository.js";
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
  attachPaymentMethodToCustomer,
  setCustomerDefaultPaymentMethod,
  getOrCreateStripeCustomer,
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
  let data = {
    clientId,
    userId,
    planId: plan._id,
    stripeCustomerId,
    stripeSubscriptionId: stripeSubscription.id,
    stripePriceId: stripePrice?.id || plan.stripePriceId,
    status: stripeSubscription?.status || "active",
    amount: plan.amount,
    currency: plan.currency,
    interval: stripePrice?.recurring?.interval ?? plan.interval,
    currentPeriodStart: stripeDate(subscriptionItem.current_period_start),
    currentPeriodEnd: stripeDate(subscriptionItem.current_period_end),
    cancelAtPeriodEnd: Boolean(stripeSubscription.cancel_at_period_end),
    canceledAt: stripeDate(stripeSubscription.canceled_at),
    trialStart: stripeDate(stripeSubscription.trial_start),
    trialEnd: stripeDate(stripeSubscription.trial_end),
  };
  return data
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
  billingDetails,
}) => {
  /*
   * 1. Existing subscription check
   */

  const existingSubscription = await findSubscriptionByClientId(clientId);

  if (
    existingSubscription &&
    !["canceled", "incomplete_expired"].includes(
      existingSubscription.status
    )
  ) {
    const error = new Error(
      "Client already has an active or pending subscription"
    );

    error.statusCode = 400;
    throw error;
  }

  /*
   * 2. Find plan
   */

  const plan = await findSubscriptionPlanById(planId);

  if (!plan) {
    const error = new Error("Subscription plan not found");

    error.statusCode = 404;
    throw error;
  }

  if (!plan.stripePriceId) {
    const error = new Error(
      "Stripe price ID is missing for this plan"
    );

    error.statusCode = 400;
    throw error;
  }

  /*
   * 3. Get client
   */

  const client = await findClientById(clientId);

  /*
   * 4. Reuse existing Stripe Customer
   */

  const stripeCustomer = await getOrCreateStripeCustomer({
    customerId: client?.stripeCustomerId || client?.stripe_customer,
    name: fullName,
    email,
    address: billingDetails.address,
    metadata: {
      clientId: String(clientId),
      userId: String(userId),
    },
  });

  /*
   * 5. Attach PaymentMethod
   */

  if (paymentMethodId) {
    await attachPaymentMethodToCustomer({
      paymentMethodId,
      customerId: stripeCustomer.id,
    });

    await setCustomerDefaultPaymentMethod({
      customerId: stripeCustomer.id,
      paymentMethodId,
    });
  }

  /*
   * 6. Create Stripe subscription
   */

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

  /*
   * 7. Extract client secret
   */

  const paymentData = extractSubscriptionPaymentData(
    stripeSubscription
  );

  /*
   * 8. Save Stripe customer ID only
   *
   * Do not activate plan before payment success.
   */

  await updateClient(clientId, {
    active_plan: plan?.name,
    current_plan_id: plan?._id,
    stripe_customer: stripeCustomer.id,
  });

  /*
   * 9. Save subscription in MongoDB
   */

  const subscriptionData = buildSubscriptionData({
    stripeSubscription,
    clientId,
    userId,
    plan,
    stripeCustomerId: stripeCustomer.id,
  });
  console.log("subscriptionData", subscriptionData)
  const subscription = await createSubscription(
    subscriptionData
  );

  let updateData = {
    status: "active",
  };
  const updatedSubscription = await updateSubscriptionById(
    subscription?._id,
    updateData,
  );

  /*
   * 10. Return frontend response
   */
  return {
    subscription,
    stripeCustomer: {
      id: stripeCustomer.id,
    },
    invoiceId: paymentData.invoiceId,
    paymentIntent: null,
    paymentIntentId: paymentData.paymentIntentId,
    paymentIntentStatus: paymentData.paymentIntentStatus,
    clientSecret: paymentData.clientSecret,
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
  // --------------------------------------------
  // 1. Find current subscription
  // --------------------------------------------

  const currentSubscription =
    await findSubscriptionById(subscriptionId);
  if (!currentSubscription) {
    const error = new Error("Subscription not found");
    error.statusCode = 404;
    throw error;
  }

  // --------------------------------------------
  // 2. Find new plan
  // --------------------------------------------

  const newPlan =
    await findSubscriptionPlanById(planId);

  if (!newPlan) {
    const error = new Error("Subscription plan not found");
    error.statusCode = 404;
    throw error;
  }

  // --------------------------------------------
  // 3. Same plan check
  // --------------------------------------------

  if (
    currentSubscription.planId?._id?.toString() === newPlan._id.toString() ||
    currentSubscription.stripePriceId === newPlan.stripePriceId
  ) {
    const error = new Error("You are already subscribed to this plan");
    error.statusCode = 400;
    throw error;
  }

  // --------------------------------------------
  // 4. Change Stripe subscription + pay invoice
  // --------------------------------------------

  const stripeResult =
    await changeStripeSubscriptionPlan({
      subscriptionId: currentSubscription.stripeSubscriptionId,
      priceId: newPlan.stripePriceId,
    });
  const stripeSubscription = stripeResult.subscription;
  const invoice = stripeResult.invoice;
  const paymentIntent = stripeResult.paymentIntent;

  // --------------------------------------------
  // 5. Check payment
  // --------------------------------------------

  if (paymentIntent) {
    if (paymentIntent.status === "requires_action") {
      const error = new Error("Payment authentication is required");
      error.statusCode = 402;
      error.paymentRequired = true;
      error.requiresAction = true;
      error.clientSecret = paymentIntent.client_secret;
      error.paymentIntentId = paymentIntent.id;
      error.subscriptionId = stripeSubscription.id;
      throw error;
    }

    if (paymentIntent.status !== "succeeded") {
      const error = new Error("Payment was not completed");
      error.statusCode = 402;
      error.paymentRequired = true;
      error.paymentStatus = paymentIntent.status;
      error.clientSecret = paymentIntent.client_secret;
      error.paymentIntentId = paymentIntent.id;
      throw error;
    }
  }

  // --------------------------------------------
  // 6. Make sure invoice is paid
  // --------------------------------------------

  if (
    invoice &&
    invoice.status !== "paid" &&
    invoice.amount_remaining > 0
  ) {
    const error = new Error("Upgrade payment is incomplete");
    error.statusCode = 402;
    error.paymentRequired = true;
    error.invoiceId = invoice.id;
    error.amountDue = invoice.amount_remaining;
    throw error;
  }
  console.log("newPlan", newPlan)
  // --------------------------------------------
  // 7. Only NOW update MongoDB
  // --------------------------------------------
  await updateClient(currentSubscription.clientId?._id, {
    active_plan: newPlan?.name,
    current_plan_id: newPlan?._id,
  });

  const updateData = buildSubscriptionData({
    stripeSubscription,
    clientId: currentSubscription.clientId?._id || currentSubscription.clientId,
    userId: currentSubscription.userId,
    plan: newPlan,
    stripeCustomerId: currentSubscription.stripeCustomerId,
  });

  const updatedSubscription =
    await updateSubscriptionById(
      subscriptionId,
      updateData,
    );

  return {
    subscription: updatedSubscription,
    stripeSubscription,
    invoice,
    paymentIntent,
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
      subtotal: invoice.subtotal / 100,
      total: invoice.total / 100,
      amountDue: invoice.amount_due / 100,
      currency: invoice.currency,
      periodStart: stripeDate(invoice.period_start),
      periodEnd: stripeDate(invoice.period_end),
    },
    amountDue: invoice.amount_due / 100,
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
  const subscription = await findSubscriptionById(subscriptionId);

  if (!subscription) {
    const error = new Error("Subscription not found");
    error.statusCode = 404;
    throw error;
  }

  // Already cancelled check
  if (
    subscription.status === "canceled" ||
    subscription.cancelAtPeriodEnd === false &&
    subscription.canceledAt
  ) {
    const error = new Error("Subscription is already canceled");
    error.statusCode = 400;
    throw error;
  }

  try {
    const stripeSubscription = await cancelStripeSubscription(
      subscription.stripeSubscriptionId
    );

    const updatedSubscription = await updateSubscriptionById(
      subscriptionId,
      {
        status: stripeSubscription.status,
        cancelAtPeriodEnd: false,
        canceledAt: stripeDate(stripeSubscription.canceled_at),
      }
    );

    return updatedSubscription;
  } catch (error) {
    console.error("Stripe cancel error:", error);

    // Stripe subscription doesn't exist / already cancelled
    if (
      error?.statusCode === 404 ||
      error?.status === 404 ||
      error?.code === "resource_missing"
    ) {
      const stripeError = new Error("Subscription is already canceled");
      stripeError.statusCode = 400;
      throw stripeError;
    }

    throw error;
  }
};

/**
 * Cancel subscription at period end
 */
export const cancelSubscriptionAtPeriodEndService = async (subscriptionId) => {
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
