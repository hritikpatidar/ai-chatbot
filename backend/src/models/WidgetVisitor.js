import mongoose from "mongoose";

const widgetVisitorSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },

    guestId: {
      type: String,
      required: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    accountStatus: {
      type: String,
      enum: ["active", "blocked", "deleted"],
      default: "active",
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

widgetVisitorSchema.index(
  { clientId: 1, email: 1 },
  { unique: true },
);

widgetVisitorSchema.index(
  { clientId: 1, guestId: 1 },
);

const WidgetVisitor = mongoose.model(
  "WidgetVisitor",
  widgetVisitorSchema,
);

export default WidgetVisitor;