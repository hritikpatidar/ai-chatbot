import cron from "node-cron";
import { processSubscriptionExpiryReminders } from "../services/subscriptionExpiryReminder.service.js";

export const startSubscriptionExpiryReminderJob = () => {
  cron.schedule(
    "0 9 * * *",
    async () => {
      try {
        console.log("⏰ Running subscription expiry reminder job");

        await processSubscriptionExpiryReminders();
      } catch (error) {
        console.error(
          "❌ Subscription expiry reminder cron failed:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};