import mongoose from "mongoose";

const aiUsageSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },

    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
      index: true,
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      default: null,
    },

    model: {
      type: String,
      required: true,
    },

    operation: {
      type: String,
      enum: ["classification", "chat"],
      required: true,
    },

    inputTokens: {
      type: Number,
      default: 0,
      min: 0,
    },

    outputTokens: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalTokens: {
      type: Number,
      default: 0,
      min: 0,
    },

    estimatedCostUsd: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["reserved", "completed", "failed"],
      default: "reserved",
    },

    periodStart: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

aiUsageSchema.index({
  clientId: 1,
  periodStart: 1,
  status: 1,
});

export default mongoose.model("AIUsage", aiUsageSchema);