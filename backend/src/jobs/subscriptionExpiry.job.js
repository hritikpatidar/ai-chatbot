import cron from "node-cron";
import { processExpiredSubscriptions } from "../services/subscriptionExpiry.service.js";


export const startSubscriptionExpiryJob = () => {

  cron.schedule(
    "0 * * * *",
    async () => {
      try {
        await processExpiredSubscriptions();
      } catch (error) {
        console.error("❌ Subscription expiry cron failed:", error);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};