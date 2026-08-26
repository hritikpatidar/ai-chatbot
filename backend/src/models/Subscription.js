import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },

    // Stripe customer
    stripeCustomerId: {
      type: String,
      required: true,
      index: true,
    },

    // Stripe subscription
    stripeSubscriptionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    stripePriceId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
        "incomplete",
        "incomplete_expired",
        "paused",
      ],
      default: "active",
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "gbp",
      lowercase: true,
    },

    interval: {
      type: String,
      enum: ["month", "year"],
      default: "month",
    },

    currentPeriodStart: {
      type: Date,
    },

    currentPeriodEnd: {
      type: Date,
    },

    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },

    canceledAt: {
      type: Date,
      default: null,
    },

    trialStart: {
      type: Date,
      default: null,
    },

    trialEnd: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Subscription = mongoose.model(
  "Subscription",
  subscriptionSchema,
);

export default Subscription;