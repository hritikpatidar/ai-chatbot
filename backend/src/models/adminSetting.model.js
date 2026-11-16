
import mongoose from "mongoose";

const platformSettingSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // General Settings
    platformName: {
      type: String,
      default: "AI Chatbot",
      trim: true,
      maxlength: 100,
    },

    supportEmail: {
      type: String,
      default: "support@yourcompany.com",
      trim: true,
      lowercase: true,
      match: [
        /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid support email",
      ],
    },

    defaultLanguage: {
      type: String,
      enum: ["en", "hi"],
      default: "en",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
      trim: true,
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    // AI Configuration
    aiModel: {
      type: String,
      trim: true,
      match: /^gemini-[a-zA-Z0-9._-]+$/,
      default: "gemini-2.5-flash",
    },

    temperature: {
      type: Number,
      default: 0.7,
      min: 0,
      max: 2,
    },

    maxOutputTokens: {
      type: Number,
      default: 2048,
      min: 1,
      max: 8192,
    },

    enableChatHistory: {
      type: Boolean,
      default: true,
    },

    enableStreaming: {
      type: Boolean,
      default: true,
    },

    enableFallback: {
      type: Boolean,
      default: true,
    },

    // Usage & Limits
    monthlyUsageAlert: {
      type: Boolean,
      default: true,
    },

    usageAlertLimit: {
      type: Number,
      default: 80,
      min: 1,
      max: 100,
    },

    // Notification Settings
    emailNotifications: {
      type: Boolean,
      default: true,
    },

    newClientNotification: {
      type: Boolean,
      default: true,
    },

    subscriptionNotification: {
      type: Boolean,
      default: true,
    },

    paymentNotification: {
      type: Boolean,
      default: true,
    },

    // Security Settings
    maxLoginAttempts: {
      type: Number,
      default: 5,
      min: 1,
      max: 20,
    },

    sessionTimeout: {
      type: Number,
      default: 30,
      min: 5,
      max: 1440,
    },

    twoFactorAuth: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const AdminSetting = mongoose.model(
  "AdminSetting",
  platformSettingSchema
);

export default AdminSetting;
