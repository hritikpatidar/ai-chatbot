
import mongoose from "mongoose";
import AdminSetting from "../models/adminSetting.model.js";

const allowedFields = [
  // General
  "platformName",
  "supportEmail",
  "defaultLanguage",
  "timezone",
  "maintenanceMode",

  // AI
  "aiModel",
  "temperature",
  "maxOutputTokens",
  "enableChatHistory",
  "enableStreaming",
  "enableFallback",

  // Usage
  "monthlyUsageAlert",
  "usageAlertLimit",

  // Notifications
  "emailNotifications",
  "newClientNotification",
  "subscriptionNotification",
  "paymentNotification",

  // Security
  "maxLoginAttempts",
  "sessionTimeout",
  "twoFactorAuth",
];

const booleanFields = [
  "maintenanceMode",
  "enableChatHistory",
  "enableStreaming",
  "enableFallback",
  "monthlyUsageAlert",
  "emailNotifications",
  "newClientNotification",
  "subscriptionNotification",
  "paymentNotification",
  "twoFactorAuth",
];

const numberFields = [
  "temperature",
  "maxOutputTokens",
  "usageAlertLimit",
  "maxLoginAttempts",
  "sessionTimeout",
];

// Convert frontend number input strings into numbers
const normalizeSettings = (payload) => {
  const normalized = {};

  for (const field of allowedFields) {
    if (!Object.prototype.hasOwnProperty.call(payload, field)) {
      continue;
    }

    const value = payload[field];

    if (booleanFields.includes(field)) {
      if (typeof value !== "boolean") {
        throw new Error(`${field} must be a boolean`);
      }

      normalized[field] = value;
      continue;
    }

    if (numberFields.includes(field)) {
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        !Number.isFinite(Number(value))
      ) {
        throw new Error(`${field} must be a valid number`);
      }

      normalized[field] = Number(value);
      continue;
    }

    if (typeof value !== "string") {
      throw new Error(`${field} must be a string`);
    }

    normalized[field] = value.trim();
  }

  return normalized;
};

// Get or create admin settings
export const getAdminSettingsService = async (adminId) => {
  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    throw new Error("Invalid admin ID");
  }

  const settings = await AdminSetting.findOneAndUpdate(
    { adminId },
    {
      $setOnInsert: {
        adminId,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    }
  ).lean();

  return settings;
};

// Update admin settings
export const updateAdminSettingsService = async (
  adminId,
  payload
) => {
  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    throw new Error("Invalid admin ID");
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    throw new Error("Invalid settings payload");
  }

  // Reject unexpected fields
  const invalidFields = Object.keys(payload).filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new Error(
      `Invalid settings fields: ${invalidFields.join(", ")}`
    );
  }

  const normalizedData = normalizeSettings(payload);

  if (Object.keys(normalizedData).length === 0) {
    throw new Error("Please provide at least one setting to update");
  }

  const settings = await AdminSetting.findOneAndUpdate(
    { adminId },
    {
      $set: normalizedData,
      $setOnInsert: { adminId },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    }
  ).lean();

  return settings;
};
