import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: false,
      index: true,
    },

    guestId: {
      type: String,
      required: false,
      index: true,
    },

    title: {
      type: String,
      default: "New Chat",
      trim: true,
    },

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    source: {
      type: String,
      enum: ["website", "widget", "mobile_app", "other"],
      default: "widget",
    },

    status: {
      type: String,
      enum: ["open", "resolved", "pending"],
      default: "open",
    },

    topic: {
      type: String,
      default: "other",
    }
  },
  {
    timestamps: true,
  },
);

conversationSchema.virtual("visitor", {
  ref: "WidgetVisitor",
  localField: "guestId",
  foreignField: "guestId",
  justOne: true,
});

conversationSchema.set("toJSON", { virtuals: true });
conversationSchema.set("toObject", { virtuals: true });

conversationSchema.index({ clientId: 1, createdAt: -1 });
conversationSchema.index({ clientId: 1, status: 1 });

export default mongoose.model("Conversation", conversationSchema);
