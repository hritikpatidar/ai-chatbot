import Stripe from "stripe";
import env from "../config/env.js";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

/* =========================================================
   CUSTOMER
========================================================= */

/**
 * Create Stripe Customer
 */
export const createStripeCustomer = async ({
  name,
  email,
  metadata = {},
}) => {
  return await stripe.customers.create({
    name,
    email,
    metadata,
  });
};

/**
 * Get Stripe Customer
 */
export const getStripeCustomer = async (customerId) => {
  return await stripe.customers.retrieve(customerId);
};

/**
 * Update Stripe Customer
 */
export const updateStripeCustomer = async (
  customerId,
  data,
) => {
  return await stripe.customers.update(customerId, data);
};

/* =========================================================
   SUBSCRIPTION
========================================================= */

/**
 * Create Stripe Subscription
 *
 * payment_behavior:
 * default_incomplete
 *
 * Isse subscription create hogi aur payment ko
 * frontend se confirm kar sakte hain.
 */
export const createStripeSubscription = async ({
  customerId,
  priceId,
  paymentMethodId = null,
  metadata = {},
}) => {
  const params = {
    customer: customerId,

    items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],

    payment_behavior: "default_incomplete",

    payment_settings: {
      save_default_payment_method: "on_subscription",
    },

    metadata,

    expand: [
      "latest_invoice.payment_intent",
      "default_payment_method",
    ],
  };

  if (paymentMethodId) {
    params.default_payment_method = paymentMethodId;
  }

  return await stripe.subscriptions.create(params);
};

/**
 * Get Stripe Subscription
 */
export const getStripeSubscription = async (
  subscriptionId,
) => {
  return await stripe.subscriptions.retrieve(subscriptionId, {
    expand: [
      "latest_invoice.payment_intent",
      "default_payment_method",
      "items.data.price.product",
    ],
  });
};

/**
 * Update Stripe Subscription
 */
export const updateStripeSubscription = async (
  subscriptionId,
  data,
) => {
  return await stripe.subscriptions.update(
    subscriptionId,
    data,
  );
};

/**
 * Change subscription plan
 */
export const changeStripeSubscriptionPlan = async ({
  subscriptionId,
  priceId,
  prorationBehavior = "always_invoice",
}) => {
  const subscription =
    await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionItem = subscription.items.data[0];

  if (!subscriptionItem) {
    throw new Error(
      "No subscription item found",
    );
  }

  return await stripe.subscriptions.update(
    subscriptionId,
    {
      items: [
        {
          id: subscriptionItem.id,
          price: priceId,
        },
      ],

      proration_behavior: prorationBehavior,

      expand: [
        "latest_invoice.payment_intent",
        "default_payment_method",
      ],
    },
  );
};

/**
 * Cancel subscription immediately
 */
export const cancelStripeSubscription = async (
  subscriptionId,
) => {
  return await stripe.subscriptions.cancel(
    subscriptionId,
  );
};

/**
 * Cancel subscription at period end
 */
export const cancelStripeSubscriptionAtPeriodEnd =
  async (subscriptionId) => {
    return await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: true,
      },
    );
  };

/**
 * Resume subscription
 */
export const resumeStripeSubscription = async (
  subscriptionId,
) => {
  return await stripe.subscriptions.update(
    subscriptionId,
    {
      cancel_at_period_end: false,
    },
  );
};

/* =========================================================
   INVOICE
========================================================= */

/**
 * Get Stripe Invoice
 */
export const getStripeInvoice = async (
  invoiceId,
) => {
  return await stripe.invoices.retrieve(invoiceId, {
    expand: [
      "payment_intent",
      "subscription",
      "customer",
    ],
  });
};

/**
 * Pay Invoice
 */
export const payStripeInvoice = async (
  invoiceId,
) => {
  return await stripe.invoices.pay(invoiceId);
};

/* =========================================================
   UPCOMING / PREVIEW INVOICE
========================================================= */

/**
 * Preview subscription upgrade / change
 *
 * IMPORTANT:
 * Stripe API versions me upcoming invoice preview
 * params change ho sakte hain.
 *
 * Current approach subscription_details ke through
 * subscription item change preview karta hai.
 */
export const previewSubscriptionChange = async ({
  customerId,
  subscriptionId,
  priceId,
}) => {
  const subscription =
    await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionItem = subscription.items.data[0];

  if (!subscriptionItem) {
    throw new Error(
      "No subscription item found",
    );
  }

  return await stripe.invoices.createPreview({
    customer: customerId,

    subscription: subscriptionId,

    subscription_details: {
      items: [
        {
          id: subscriptionItem.id,
          price: priceId,
        },
      ],

      proration_behavior: "always_invoice",
    },
  });
};

/* =========================================================
   PAYMENT METHODS
========================================================= */

/**
 * Get customer payment methods
 */
export const getStripePaymentMethods = async (
  customerId,
) => {
  return await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });
};

/**
 * Get single payment method
 */
export const getStripePaymentMethod = async (
  paymentMethodId,
) => {
  return await stripe.paymentMethods.retrieve(
    paymentMethodId,
  );
};

/**
 * Attach payment method to customer
 */
export const attachStripePaymentMethod = async ({
  paymentMethodId,
  customerId,
}) => {
  return await stripe.paymentMethods.attach(
    paymentMethodId,
    {
      customer: customerId,
    },
  );
};

/**
 * Detach payment method
 */
export const detachStripePaymentMethod = async (
  paymentMethodId,
) => {
  return await stripe.paymentMethods.detach(
    paymentMethodId,
  );
};

/**
 * Set default payment method
 */
export const setDefaultStripePaymentMethod = async ({
  customerId,
  paymentMethodId,
}) => {
  return await stripe.customers.update(
    customerId,
    {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    },
  );
};

/* =========================================================
   CUSTOMER DEFAULT PAYMENT METHOD
========================================================= */

/**
 * Get customer's default payment method
 */
export const getDefaultStripePaymentMethod =
  async (customerId) => {
    const customer =
      await stripe.customers.retrieve(
        customerId,
        {
          expand: [
            "invoice_settings.default_payment_method",
          ],
        },
      );

    return customer?.invoice_settings
      ?.default_payment_method || null;
  };

/* =========================================================
   PAYMENT INTENT
========================================================= */

/**
 * Get Payment Intent
 */
export const getStripePaymentIntent = async (
 paymentIntentId,
) => {
  return await stripe.paymentIntents.retrieve(
    paymentIntentId,
  );
};

/**
 * Confirm Payment Intent
 *
 * Normally frontend Stripe.js se payment confirmation
 * karna preferred hota hai.
 */
export const confirmStripePaymentIntent = async ({
  paymentIntentId,
  paymentMethodId,
}) => {
  return await stripe.paymentIntents.confirm(
    paymentIntentId,
    {
      payment_method: paymentMethodId,
    },
  );
};

/* =========================================================
   STRIPE CUSTOMER PAYMENT METHOD
========================================================= */

/**
 * Add payment method and make it default
 */
export const addAndSetDefaultPaymentMethod =
  async ({
    customerId,
    paymentMethodId,
  }) => {
    const paymentMethod =
      await attachStripePaymentMethod({
        paymentMethodId,
        customerId,
      });

    await setDefaultStripePaymentMethod({
      customerId,
      paymentMethodId,
    });

    return paymentMethod;
  };

/* =========================================================
   EXPORT STRIPE INSTANCE
========================================================= */

export { stripe };