import mongoose from "mongoose";

const subscriptionUsageSchema = new mongoose.Schema(
  {
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    periodStart: {
      type: Date,
      required: true,
    },
    responsesUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    responsesReserved: {
      type: Number,
      default: 0,
      min: 0,
    },
    tokensUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    tokensReserved: {
      type: Number,
      default: 0,
      min: 0,
    },
    conversationsUsed: {
      type: Number,
      default: 0,
      min: 0,
    },

    conversationsReserved: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

subscriptionUsageSchema.index(
  { subscriptionId: 1, periodStart: 1 },
  { unique: true }
);

export default mongoose.model(
  "SubscriptionUsage",
  subscriptionUsageSchema
);