import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },

    visitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WidgetVisitor",
      required: true,
      index: true,
    },

    guestId: {
      type: String,
      required: true,
      index: true,
    },

    sessionTokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;