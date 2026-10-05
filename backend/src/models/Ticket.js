import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    guestId: {
      type: String,
      ref: "WidgetVisitor",
      default: null,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "open",
        "in_progress",
        "resolved",
        "closed",
      ],
      default: "open",
    },
    source: {
      type: String,
      enum: ["ai_chat"],
      default: "ai_chat",
    },
  },
  {
    timestamps: true,
  },
);


ticketSchema.virtual("guestKeyId", {
  ref: "WidgetVisitor",
  localField: "guestId",
  foreignField: "guestId",
  justOne: true,
});

ticketSchema.set("toJSON", { virtuals: true });
ticketSchema.set("toObject", { virtuals: true });

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;