import transporter from "../config/mail.js";
import env from "../config/env.js";

import {
    findSubscriptionsForExpiryReminder,
    updateSubscriptionById,
} from "../repositories/subscription.repository.js";

import { findClientUserFcmTokenByClientId } from "../repositories/user.repository.js";

import { subscriptionExpiryReminderEmailTemplate } from "../helpers/emailTemplate.js";
import { createAndSendNotification } from "./notification.service.js";

// IST date boundaries: two days from today's Indian calendar date
const getReminderDateRange = () => {
    const now = new Date();

    const istDate = new Date(
        now.toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
        })
    );

    istDate.setHours(0, 0, 0, 0);
    istDate.setDate(istDate.getDate() + 1);

    // Convert IST midnight to UTC
    const startDate = new Date(istDate.getTime() - (5 * 60 + 30) * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

    return { startDate, endDate };
};

export const processSubscriptionExpiryReminders = async () => {
    const { startDate, endDate } = getReminderDateRange();

    const subscriptions =
        await findSubscriptionsForExpiryReminder(startDate, endDate);

    for (const subscription of subscriptions) {
        try {
            const client = subscription.clientId;
            const user = subscription.userId;
            const plan = subscription.planId;

            if (!client?._id || !user?.email) {
                console.log(
                    `⚠️ Client/email missing for subscription ${subscription._id}`
                );
                continue;
            }

            const expiryDate = new Date(
                subscription.expiresAt
            ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                timeZone: "Asia/Kolkata",
            });


            const emailTemplate =
                subscriptionExpiryReminderEmailTemplate({
                    fullName: user.fullName,
                    businessName: client.businessName,
                    planName: plan?.name,
                    expiryDate,
                });

            await transporter.sendMail({
                from: `"AI Chatbot" <${env.MAIL_USER}>`,
                to: user.email,
                subject: emailTemplate.subject,
                html: emailTemplate.html,
            });

            await createAndSendNotification({
                clientId: client._id,
                title: "Subscription Expiring Soon",
                message: `Your ${plan?.name || "subscription"} plan expires on ${expiryDate}. Renew it to continue using our services.`,
                webRoute: "/client/subscription",
                screen: "",
                image: "https://api.naqshapp.com/naqshsvg.jpg",
                metadata: {
                    subscriptionId: null,
                    expiryDate: null,
                },
            });

            // Mark reminder sent only after both delivery operations succeed
            if (!notificationResult?.success) {
                throw new Error(
                    notificationResult?.error || "FCM notification failed"
                );
            }

            await updateSubscriptionById(subscription._id, {
                expiryReminderSent: true,
            });

            console.log(
                `✅ Expiry reminder sent for subscription ${subscription._id}`
            );
        } catch (error) {
            console.error(
                `❌ Expiry reminder failed for ${subscription._id}:`,
                error
            );
        }
    }
};