import mongoose from "mongoose";

const emailJobSchema = new mongoose.Schema(
  {
    to: {
      type: String,
      required: true,
      trim: true,
    },
    from: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    inReplyTo: {
      type: String,
      default: null,
    },
    references: {
      type: String,
      default: null,
    },
    supportTicketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupportTicket",
      default: null,
    },
    purpose: {
      type: String,
      enum: ["generic", "support-ticket-confirmation"],
      default: "generic",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "sent", "failed"],
      default: "pending",
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    nextAttemptAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    lastError: {
      type: String,
      default: "",
    },
    messageId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

emailJobSchema.index({ status: 1, nextAttemptAt: 1, createdAt: 1 });
emailJobSchema.index({ status: 1, lockUntil: 1 });

const EmailJob = mongoose.model("EmailJob", emailJobSchema);

export default EmailJob;
