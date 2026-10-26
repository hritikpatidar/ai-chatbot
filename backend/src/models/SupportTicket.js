import mongoose from "mongoose";

const supportReplySchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["admin", "client"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const supportTicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      index: true,
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },

    clientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    clientName: {
      type: String,
      default: "",
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },

    planName: {
      type: String,
      enum: ["Basic", "Pro"],
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "High"],
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
      index: true,
    },

    replies: {
      type: [supportReplySchema],
      default: [],
    },

    lastReplyAt: {
      type: Date,
      default: Date.now,
    },
    
    clientConfirmationMessageId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

supportTicketSchema.pre("validate", function () {
  if (!this.ticketNumber) {
    this.ticketNumber = `TKT-${new mongoose.Types.ObjectId()
      .toString()
      .slice(-8)
      .toUpperCase()}`;
  }
});

supportTicketSchema.index({ createdAt: -1 });
supportTicketSchema.index({ priority: 1, status: 1, createdAt: -1 });

const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);

export default SupportTicket;