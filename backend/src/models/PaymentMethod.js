import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },

    stripeCustomerId: {
      type: String,
      required: true,
      index: true,
    },

    stripePaymentMethodId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    type: {
      type: String,
      default: "card",
    },

    card: {
      brand: {
        type: String,
        default: "",
      },

      last4: {
        type: String,
        default: "",
      },

      expMonth: {
        type: Number,
      },

      expYear: {
        type: Number,
      },

      funding: {
        type: String,
        default: "",
      },
    },

    isDefault: {
      type: Boolean,
      default: false,
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

const PaymentMethod = mongoose.model(
  "PaymentMethod",
  paymentMethodSchema,
);

export default PaymentMethod;