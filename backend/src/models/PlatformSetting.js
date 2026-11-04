import mongoose from "mongoose";

const platformSettingSchema = new mongoose.Schema(
    {
        platformName: {
            type: String,
            default: "AI Chatbot",
        },

        supportEmail: {
            type: String,
            default: "",
        },

        defaultLanguage: {
            type: String,
            default: "en",
        },

        timezone: {
            type: String,
            default: "Asia/Kolkata",
        },

        aiSettings: {
            defaultModel: {
                type: String,
                default: "gemini-2.5-flash",
            },
            temperature: {
                type: Number,
                default: 0.7,
            },
            maxOutputTokens: {
                type: Number,
                default: 2048,
            },
        },

        notificationSettings: {
            emailNotifications: { type: Boolean, default: true },
            newClientNotification: { type: Boolean, default: true },
            subscriptionNotification: { type: Boolean, default: true },
            paymentNotification: { type: Boolean, default: true },
        },

        securitySettings: {
            maxLoginAttempts: { type: Number, default: 5 },
            sessionTimeout: { type: Number, default: 30 },
            twoFactorAuth: { type: Boolean, default: false },
        },

        maintenanceMode: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model(
    "PlatformSetting",
    platformSettingSchema
);