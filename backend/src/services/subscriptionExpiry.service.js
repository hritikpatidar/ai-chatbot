import transporter from "../config/mail.js";
import env from "../config/env.js";
import { findExpiredSubscriptions, markSubscriptionExpired } from "../repositories/subscription.repository.js";
import { subscriptionExpiredEmailTemplate } from "../helpers/emailTemplate.js";
import { updateClientById } from "../repositories/client.repository.js";

export const processExpiredSubscriptions = async () => {
    const expiredSubscriptions = await findExpiredSubscriptions();
    for (const subscription of expiredSubscriptions) {
        try {
            const client = subscription.clientId;
            const userId = subscription.userId;

            if (!userId?.email) {
                console.log(`⚠️ Email not found for subscription ${subscription._id}`);
                continue;
            }

            const expiredDate =
                subscription.expiresAt
                    ? subscription.expiresAt.toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }
                    )
                    : "N/A";


            await markSubscriptionExpired(
                subscription._id
            );

            const clientId = client._id
            await updateClientById(clientId, {
                active_plan: null,
                current_plan_id: null,
                stripe_customer: null,
                status: "inactive"
            });

            const emailTemplate =
                subscriptionExpiredEmailTemplate({
                    fullName: userId.fullName,
                    businessName: client.businessName,
                    planName: subscription.planId?.name,
                    expiredDate,
                });

            const info =
                await transporter.sendMail({
                    from: `"AI Chatbot" <${env.MAIL_USER}>`,
                    to: userId.email,
                    subject: emailTemplate.subject,
                    html: emailTemplate.html,
                });

            console.log(`✅ Expiry email sent to ${userId.email}`, info.messageId);


            console.log(`✅ Subscription marked expired: ${subscription._id}`);
        } catch (error) {
            console.error(`❌ Failed to process subscription ${subscription._id}`, error);
            // Continue with next subscription
            continue;
        }
    }
};