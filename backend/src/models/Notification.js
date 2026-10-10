import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Notification kis user ko bhejni hai
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Client/business account
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Example: /client/subscription
    webRoute: {
      type: String,
      default: "/",
    },

    // Example: subscription, ticket, dashboard
    screen: {
      type: String,
      default: "notification",
    },

    image: {
      type: String,
      default: null,
    },

    // subscription_expiry, ticket_assigned, etc.
    type: {
      type: String,
      enum: [
        "subscription",
        "message",
        "settings",
        "alert",
        "ticket",
        "system",
        "general",
      ],
      default: "general",
      index: true,
    },

    // Read/unread state
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Fast paginated notification list
notificationSchema.index({
  userId: 1,
  createdAt: -1,
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;