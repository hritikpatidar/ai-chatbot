import env from "../config/env.js";
import {
  getStripePaymentIntent,
  confirmStripePaymentIntent,
  getStripeInvoice,
  stripe,
} from "../services/stripe.service.js";
import { syncSubscriptionFromStripe } from "../services/subscription.service.js";

/* =========================================================
   GET PAYMENT INTENT
   GET /api/stripe/payment-intent/:paymentIntentId
========================================================= */

export const getPaymentIntent = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: "Payment Intent ID is required",
      });
    }

    const paymentIntent = await getStripePaymentIntent(paymentIntentId);

    return res.status(200).json({
      success: true,
      message: "Payment intent fetched successfully",
      data: paymentIntent,
    });
  } catch (error) {
    console.error("Get payment intent error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch payment intent",
    });
  }
};

/* =========================================================
   CONFIRM PAYMENT INTENT
   POST /api/stripe/payment-intent/confirm
========================================================= */

export const confirmPaymentIntent = async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: "Payment Intent ID is required",
      });
    }

    if (!paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: "Payment Method ID is required",
      });
    }

    const paymentIntent = await confirmStripePaymentIntent({
      paymentIntentId,
      paymentMethodId,
    });

    return res.status(200).json({
      success: true,
      message: "Payment intent confirmed successfully",
      data: paymentIntent,
    });
  } catch (error) {
    console.error("Confirm payment intent error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to confirm payment intent",
    });
  }
};

/* =========================================================
   GET INVOICE
   GET /api/stripe/invoice/:invoiceId
========================================================= */

export const getInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    if (!invoiceId) {
      return res.status(400).json({
        success: false,
        message: "Invoice ID is required",
      });
    }

    const invoice = await getStripeInvoice(invoiceId);

    return res.status(200).json({
      success: true,
      message: "Invoice fetched successfully",
      data: invoice,
    });
  } catch (error) {
    console.error("Get invoice error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch invoice",
    });
  }
};

/* =========================================================
   STRIPE WEBHOOK
========================================================= */

export const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error.message,
    );

    return res.status(400).json({
      success: false,
      message: "Invalid Stripe webhook signature",
    });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created": {
        await syncSubscriptionFromStripe(event.data.object);

        break;
      }

      case "customer.subscription.updated": {
        await syncSubscriptionFromStripe(event.data.object);

        break;
      }

      case "customer.subscription.deleted": {
        await syncSubscriptionFromStripe(event.data.object);

        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;

        console.log("Stripe invoice paid:", invoice.id);

        if (invoice.subscription) {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            invoice.subscription,
          );

          await syncSubscriptionFromStripe(stripeSubscription);
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;

        console.log("Stripe invoice payment failed:", invoice.id);

        if (invoice.subscription) {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            invoice.subscription,
          );

          await syncSubscriptionFromStripe(stripeSubscription);
        }

        break;
      }

      case "invoice.payment_action_required": {
        const invoice = event.data.object;

        console.log("Stripe payment action required:", invoice.id);

        if (invoice.subscription) {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            invoice.subscription,
          );

          await syncSubscriptionFromStripe(stripeSubscription);
        }

        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Webhook processing failed",
    });
  }
};
