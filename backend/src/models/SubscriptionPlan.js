import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Stripe Price ID
    stripePriceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Stripe Product ID
    stripeProductId: {
      type: String,
      required: true,
      trim: true,
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
      trim: true,
    },

    interval: {
      type: String,
      enum: ["month", "year"],
      default: "month",
    },

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    // Plan hierarchy
    // Example:
    // beginner = 1
    // basic = 2
    // pro = 3
    sortOrder: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema,
);

export default SubscriptionPlan;