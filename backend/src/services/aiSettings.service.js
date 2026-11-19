import env from "../config/env.js";
import AdminSetting from "../models/adminSetting.model.js";
import User from "../models/User.js";

const defaultSettings = {
  aiModel: env.GEMINI_MODEL || "gemini-2.5-flash",
  defaultLanguage: "en",
  temperature: 0.7,
  maxOutputTokens: 2048,
  monthlyUsageAlert: true,
  usageAlertLimit: 80,
};

export const getAISettingsForRequest = async ({
  adminId,
  client,
} = {}) => {
  let settingsAdminId = client?.adminId || adminId;

  if (!settingsAdminId) {
    // Legacy clients and unowned chats use the first admin as platform owner.
    const primaryAdmin = await User.findOne({ role: "admin" })
      .sort({ createdAt: 1 })
      .select("_id")
      .lean();

    settingsAdminId = primaryAdmin?._id;
  }

  if (!settingsAdminId) {
    return defaultSettings;
  }

  const settings = await AdminSetting.findOne({
    adminId: settingsAdminId,
  })
    .select(
      "aiModel defaultLanguage temperature maxOutputTokens monthlyUsageAlert usageAlertLimit",
    )
    .lean();

  return {
    aiModel: settings?.aiModel || defaultSettings.aiModel,
    defaultLanguage: settings?.defaultLanguage || defaultSettings.defaultLanguage,
    temperature: settings?.temperature ?? defaultSettings.temperature,
    maxOutputTokens:
      settings?.maxOutputTokens ?? defaultSettings.maxOutputTokens,
    monthlyUsageAlert:
      settings?.monthlyUsageAlert ?? defaultSettings.monthlyUsageAlert,
    usageAlertLimit:
      settings?.usageAlertLimit ?? defaultSettings.usageAlertLimit,
  };
};
