import env from "../config/env.js";
import transporter from "../config/mail.js";
import { subscriptionCancellationEmailTemplate, subscriptionPlanChangedEmailTemplate, subscriptionPurchaseEmailTemplate } from "../helpers/emailTemplate.js";
import { extractSubscriptionPaymentData } from "../helpers/stripePayment.js";
import SubscriptionUsage from "../models/SubscriptionUsage.js";
import { findClientById, updateClientById } from "../repositories/client.repository.js";
import {
  findSubscriptionByClientId,
  findSubscriptionByUserId,
  findSubscriptionById,
  findSubscriptionByStripeId,
  createSubscription,
  updateSubscriptionById,
  updateSubscriptionByStripeId,
  deleteSubscriptionById,
} from "../repositories/subscription.repository.js";

import {
  findActiveSubscriptionPlans,
  findSubscriptionPlanById,
  findSubscriptionPlanByStripePriceId,
} from "../repositories/subscriptionPlan.repository.js";
import { findClientUserFcmTokenByClientId } from "../repositories/user.repository.js";
import { createAndSendNotification } from "./notification.service.js";

import mongoose from "mongoose";

import Subscription from "../models/Subscription.js";
import SubscriptionPlan from "../models/SubscriptionPlan.js";
import Client from "../models/Client.js";

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

  const currentPeriodStart =
    subscriptionItem.current_period_start
      ? new Date(
        subscriptionItem.current_period_start * 1000
      )
      : null;

  const currentPeriodEnd =
    subscriptionItem.current_period_end
      ? new Date(
        subscriptionItem.current_period_end * 1000
      )
      : null;
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
    expiresAt: currentPeriodEnd,
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

  await updateClientById(clientId, {
    active_plan: plan?.name,
    current_plan_id: plan?._id,
    stripe_customer: stripeCustomer.id,
    status: "active"
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
  const subscription = await createSubscription(
    subscriptionData
  );

  try {
    const emailTemplate = subscriptionPurchaseEmailTemplate({
      fullName,
      businessName: client?.businessName,
      planName: plan.name,
      amount: (Number(plan.amount) / 100).toFixed(2),
      currency: plan.currency || "GBP",
      billingInterval:
        plan.interval === "year"
          ? "Yearly"
          : "Monthly",
      subscriptionId: stripeSubscription.id,
      invoiceId: paymentData.invoiceId,
      invoiceUrl: stripeSubscription.latest_invoice.hosted_invoice_url,
      invoicePdf: stripeSubscription.latest_invoice.invoice_pdf,
    });

    const info = await transporter.sendMail({
      from: `"AI Chatbot" <${env.MAIL_USER}>`,
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    await createAndSendNotification({
      type: "subscription",
      clientId: clientId,
      title: "subscription purchase",
      message: `You have successfully purchased the ${plan.name} plan. Your subscription and chatbot is now active.`,
      webRoute: "/client/subscription",
      screen: "",
      image: "https://api.naqshapp.com/naqshsvg.jpg",
      metadata: {
        subscriptionId: stripeSubscription.id,
        expiryDate: null,
      },
    });

    console.log(
      `✅ Subscription purchase email sent to ${email}`,
      info.messageId
    );
  } catch (error) {
    console.error(
      `❌ Failed to send subscription purchase email to ${email}`,
      error
    );
  }

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
  fullName,
  email
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
  // 3. Same plan check
  // --------------------------------------------
  const oldPlanName =
    currentSubscription.planId?.name ||
    "Previous Plan";

  const oldPlanAmount =
    (Number(currentSubscription.planId?.amount || 0) / 100);

  const newPlanAmount =
    (Number(newPlan.amount || 0) / 100);
  const changeType =
    newPlanAmount > oldPlanAmount
      ? "upgrade"
      : "downgrade";
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
  // --------------------------------------------
  // 7. Only NOW update MongoDB
  // --------------------------------------------
  await updateClientById(currentSubscription.clientId?._id, {
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

  try {
    const emailTemplate =
      subscriptionPlanChangedEmailTemplate({
        fullName,
        oldPlanName,
        newPlanName: newPlan.name,
        changeType,
        amount: (Number(newPlan.amount) / 100).toFixed(2),
        currency: newPlan.currency || "GBP",
        billingInterval:
          newPlan.interval === "year"
            ? "Yearly"
            : "Monthly",
        subscriptionId: stripeSubscription.id,
        invoiceId: invoice?.id || null,
        invoiceUrl: stripeSubscription.latest_invoice.hosted_invoice_url,
        invoicePdf: stripeSubscription.latest_invoice.invoice_pdf,
      });

    const info =
      await transporter.sendMail({
        from: `"AI Chatbot" <${env.MAIL_USER}>`,
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });

    await createAndSendNotification({
      type: "subscription",
      clientId: currentSubscription.clientId?._id,
      title: `subscription ${changeType}`,
      message: `You have successfully ${changeType}d your subscription to the ${newPlan.name} plan. Your subscription is now active.`,
      webRoute: "/client/subscription",
      screen: "",
      image: "https://api.naqshapp.com/naqshsvg.jpg",
      metadata: {
        subscriptionId: stripeSubscription.id,
        expiryDate: null,
      },
    });

    console.log(
      `✅ Subscription ${changeType} email sent to ${email}`,
      info.messageId
    );

  } catch (error) {

    console.error(
      `❌ Failed to send subscription ${changeType} email to ${email}`,
      error
    );

  }

  return {
    subscription: updatedSubscription,
    stripeSubscription,
    invoice,
    invoiceUrl: stripeSubscription.latest_invoice.hosted_invoice_url,
    invoicePdf: stripeSubscription.latest_invoice.invoice_pdf,
    paymentIntent,
    changeType
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
export const cancelSubscriptionService = async (subscriptionId, fullName, email) => {
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

  const oldPlanName =
    subscription.planId?.name ||
    subscription.planName ||
    "Subscription Plan";

  const oldPlanAmount =
    subscription.planId?.amount ||
    subscription.amount ||
    0;

  const oldCurrency =
    subscription.planId?.currency ||
    subscription.currency ||
    "GBP";

  const oldBillingInterval =
    subscription.planId?.interval === "year"
      ? "Yearly"
      : "Monthly";
  const stripeSubscriptionId = subscription.stripeSubscriptionId;
  try {
    const stripeSubscription = await cancelStripeSubscription(
      stripeSubscriptionId
    );
    const clientId = subscription.clientId
    await updateClientById(clientId, {
      active_plan: null,
      current_plan_id: null,
      stripe_customer: null,
      status: "inactive"
    });
    await updateSubscriptionById(subscriptionId, {
      status: "canceled",
      expiryEmailSent: true,
      canceledAt: new Date(),
    });

    await SubscriptionUsage.deleteOne({
      subscriptionId,
      clientId
    });
    // const updatedSubscription = await deleteSubscriptionById(subscriptionId);
    try {
      const emailTemplate = subscriptionCancellationEmailTemplate({
        fullName,
        businessName: subscription.clientId?.businessName,
        planName: oldPlanName,
        subscriptionId: stripeSubscriptionId,
        cancellationDate:
          new Date().toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          ),
        amount: (Number(oldPlanAmount) / 100).toFixed(2),
        currency: oldCurrency,
        billingInterval: oldBillingInterval,
      });

      const info =
        await transporter.sendMail({
          from: `"AI Chatbot" <${env.MAIL_USER}>`,
          to: email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });

      console.log(
        `✅ Subscription cancellation email sent to ${email}`,
        info.messageId
      );

      await createAndSendNotification({
        type: "subscription",
        clientId: clientId,
        title: `Subscription Cancelled`,
        message: `Your subscription has been successfully cancelled. We hope to see you back soon!`,
        webRoute: "/client/subscription",
        screen: "",
        image: "https://api.naqshapp.com/naqshsvg.jpg",
        metadata: {
          subscriptionId: null,
          expiryDate: null,
        },
      });

    } catch (emailError) {
      console.error(
        `❌ Failed to send cancellation email to ${email}`,
        emailError
      );
    }
    return {};
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
// export const removePaymentMethodService = async ({
//   subscriptionId,
//   paymentMethodId,
// }) => {
//   const subscription = await findSubscriptionById(subscriptionId);

//   if (!subscription) {
//     const error = new Error("Subscription not found");

//     error.statusCode = 404;

//     throw error;
//   }

//   return await detachStripePaymentMethod(paymentMethodId);
// };


export const removePaymentMethodService = async ({
  subscriptionId,
  paymentMethodId,
}) => {
  const subscription =
    await findSubscriptionById(subscriptionId);

  if (!subscription) {
    const error = new Error("Subscription not found");

    error.statusCode = 404;

    throw error;
  }

  const customerId =
    subscription.stripeCustomerId;

  if (!customerId) {
    const error = new Error("Stripe customer ID not found");
    error.statusCode = 400;
    throw error;
  }

  // --------------------------------------------------
  // 1. Get all customer's saved card payment methods
  // --------------------------------------------------

  const paymentMethods = await getStripePaymentMethods(customerId);
  const remainingPaymentMethods =
    paymentMethods.data.filter(
      (paymentMethod) =>
        paymentMethod.id !== paymentMethodId,
    );

  // --------------------------------------------------
  // 2. Check whether payment method exists
  // --------------------------------------------------

  const paymentMethodExists =
    paymentMethods.data.some(
      (paymentMethod) =>
        paymentMethod.id === paymentMethodId,
    );

  if (!paymentMethodExists) {
    const error = new Error("Payment method not found");
    error.statusCode = 404;
    throw error;
  }

  // --------------------------------------------------
  // 3. If another card exists,
  //    make it default BEFORE deleting old card
  // --------------------------------------------------

  let newDefaultPaymentMethod = null;
  if (remainingPaymentMethods.length > 0) {
    newDefaultPaymentMethod = remainingPaymentMethods[0];

    await setDefaultStripePaymentMethod({
      customerId,
      paymentMethodId: newDefaultPaymentMethod.id,
    });
  }

  // --------------------------------------------------
  // 4. Detach old payment method
  // --------------------------------------------------

  const detachedPaymentMethod =
    await detachStripePaymentMethod(
      paymentMethodId,
    );

  // --------------------------------------------------
  // 5. Return useful response
  // --------------------------------------------------

  return {
    deletedPaymentMethod:
      detachedPaymentMethod,

    newDefaultPaymentMethod:
      newDefaultPaymentMethod
        ? {
          id: newDefaultPaymentMethod.id,
          brand:
            newDefaultPaymentMethod.card?.brand,
          last4:
            newDefaultPaymentMethod.card?.last4,
          exp_month:
            newDefaultPaymentMethod.card?.exp_month,
          exp_year:
            newDefaultPaymentMethod.card?.exp_year,
        }
        : null,
  };
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


//admin subscription analytics
// Search input ko safe regex mein convert karo
const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const VALID_STATUSES = [
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "incomplete",
  "incomplete_expired",
  "paused",
];

export const getAdminSubscriptionsService = async (query = {}) => {
  const {
    search = "",
    status = "all",
  } = query;

  const pageLimit = 10;

  if (status !== "all" && !VALID_STATUSES.includes(status)) {
    const error = new Error("Invalid subscription status");
    error.statusCode = 400;
    throw error;
  }
  const [
    totalSubscriptions,
    totalClients,
    statusCounts,
    revenueData,
  ] = await Promise.all([
    Subscription.countDocuments(),

    Client.countDocuments(),

    Subscription.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),

    // Monthly recurring revenue, currency-wise
    Subscription.aggregate([
      // {
      //   $match: {
      //     status: "active",
      //   },
      // },
      {
        $group: {
          _id: "$currency",
          monthlyRevenue: {
            $sum: {
              $cond: [
                { $eq: ["$interval", "year"] },
                { $divide: ["$amount", 12] },
                "$amount",
              ],
            },
          },
          subscriptions: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          currency: "$_id",
          monthlyRevenue: {
            $round: ["$monthlyRevenue", 0],
          },
          subscriptions: 1,
        },
      },
    ]),
  ]);

  const statusSummary = Object.fromEntries(
    VALID_STATUSES.map((item) => [item, 0]),
  );

  statusCounts.forEach((item) => {
    statusSummary[item._id] = item.count;
  });

  const activeSubscriptions = statusSummary.active;

  // --------------------------------------------------
  // 2. PLAN OVERVIEW
  // --------------------------------------------------

  const plans = await SubscriptionPlan.aggregate([
    {
      $lookup: {
        from: Subscription.collection.name,
        let: { planId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$planId", "$$planId"],
              },
            },
          },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],
        as: "subscriptionStats",
      },
    },
    {
      $addFields: {
        totalSubscribers: {
          $sum: "$subscriptionStats.count",
        },
        activeSubscribers: {
          $let: {
            vars: {
              activeItem: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$subscriptionStats",
                      as: "item",
                      cond: { $eq: ["$$item._id", "active"] },
                    },
                  },
                  0,
                ],
              },
            },
            in: { $ifNull: ["$$activeItem.count", 0] },
          },
        },
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        amount: 1,
        currency: 1,
        interval: 1,
        status: 1,
        sortOrder: 1,
        totalSubscribers: 1,
        activeSubscribers: 1,
      },
    },
    {
      $sort: { sortOrder: 1, createdAt: 1 },
    },
  ]);

  // --------------------------------------------------
  // 3. SUBSCRIPTION LIST + SEARCH + STATUS FILTER
  // --------------------------------------------------

  const pipeline = [
    {
      $lookup: {
        from: "clients",
        localField: "clientId",
        foreignField: "_id",
        as: "client",
      },
    },
    {
      $unwind: {
        path: "$client",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: SubscriptionPlan.collection.name,
        localField: "planId",
        foreignField: "_id",
        as: "plan",
      },
    },
    {
      $unwind: {
        path: "$plan",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  const filters = {};

  if (status !== "all") {
    filters.status = status;
  }

  if (mongoose.Types.ObjectId.isValid(query.planId)) {
    filters.planId = new mongoose.Types.ObjectId(query.planId);
  }

  if (search.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");

    filters.$or = [
      { "client.businessName": regex },
      { "user.fullName": regex },
      { "user.email": regex },
      { stripeSubscriptionId: regex },
    ];
  }

  pipeline.push({
    $match: filters,
  });

  pipeline.push({
    $facet: {
      metadata: [
        { $count: "total" },
      ],

      subscriptions: [
        { $sort: { createdAt: -1 } },
        { $limit: pageLimit },
        {
          $project: {
            _id: 1,
            stripeSubscriptionId: 1,
            status: 1,
            amount: 1,
            currency: 1,
            interval: 1,
            currentPeriodStart: 1,
            currentPeriodEnd: 1,
            expiresAt: 1,
            cancelAtPeriodEnd: 1,
            canceledAt: 1,
            trialStart: 1,
            trialEnd: 1,
            createdAt: 1,

            client: {
              _id: "$client._id",
              businessName: "$client.businessName",
              email: "$client.contact.email",
            },

            user: {
              _id: "$user._id",
              fullName: "$user.fullName",
              email: "$user.email",
            },

            plan: {
              _id: "$plan._id",
              name: "$plan.name",
              amount: "$plan.amount",
              currency: "$plan.currency",
              interval: "$plan.interval",
            },
          },
        },
      ],
    },
  });

  const [listResult] = await Subscription.aggregate(pipeline);

  const subscriptions = listResult?.subscriptions || [];
  const totalRecords = listResult?.metadata?.[0]?.total || 0;

  // --------------------------------------------------
  // 4. FINAL RESPONSE
  // --------------------------------------------------

  return {
    stats: {
      totalSubscriptions,
      activeSubscriptions,
      trialingSubscriptions: statusSummary.trialing,
      pastDueSubscriptions: statusSummary.past_due,
      canceledSubscriptions: statusSummary.canceled,
      unpaidSubscriptions: statusSummary.unpaid,
      incompleteSubscriptions: statusSummary.incomplete,
      totalClients,
      monthlyRevenue: revenueData,
    },

    statusSummary,

    plans,

    subscriptions,
  };
};