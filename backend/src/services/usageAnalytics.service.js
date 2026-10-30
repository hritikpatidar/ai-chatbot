import Subscription from "../models/Subscription.js";
import SubscriptionUsage from "../models/SubscriptionUsage.js";


const getUsageStats = (used = 0, limit = 0) => {
    const percentage =
        limit > 0 ? Number(((used / limit) * 100).toFixed(1)) : 0;
    return {
        used,
        limit,
        remaining: Math.max(limit - used, 0),
        percentage,
    };
};

export const getUsageAnalyticsService = async (clientId) => {
    // 1. Get active subscription and its plan
    console.log("clientId", clientId)
    const subscription = await Subscription.findOne({
        clientId,
        status: { $in: ["active", "trialing"] },
    }).populate("planId");

    if (!subscription) {
        const error = new Error("No active subscription found.");
        error.statusCode = 404;
        throw error;
    }

    const plan = subscription.planId;

    if (!plan) {
        const error = new Error("Subscription plan not found.");
        error.statusCode = 404;
        throw error;
    }

    // 2. Get current billing period start
    // IMPORTANT: This must match the periodStart saved
    // when creating/updating SubscriptionUsage.
    const periodStart = subscription.currentPeriodStart
        ? new Date(subscription.currentPeriodStart)
        : new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        );

    // 3. Get usage for this subscription and billing period
    const usage = await SubscriptionUsage.findOne({
        subscriptionId: subscription._id,
        clientId,
    }).lean();
    // 4. Get usage counts (default 0 if no usage document exists)
    const responsesUsed = usage?.responsesUsed || 0;
    const tokensUsed = usage?.tokensUsed || 0;
    const conversationsUsed = usage?.conversationsUsed || 0;

    // 5. Get limits from SubscriptionPlan
    const limits = plan.limits;

    return {
        subscription: {
            id: subscription._id,
            planId: plan._id,
            planName: plan.name,
            status: subscription.status,
            billingInterval: plan.interval,
        },

        period: {
            startDate: periodStart,
            endDate: subscription.currentPeriodEnd || null,
        },

        usage: {
            tokens: getUsageStats(
                tokensUsed,
                limits.monthlyTokenBudget
            ),

            conversations: getUsageStats(
                conversationsUsed,
                limits.monthlyConversations
            ),

            aiResponses: getUsageStats(
                responsesUsed,
                limits.monthlyResponses
            ),
        },

        reserved: {
            tokens: usage?.tokensReserved || 0,
            conversations: usage?.conversationsReserved || 0,
            aiResponses: usage?.responsesReserved || 0,
        },

        limits: {
            maxInputTokens: limits.maxInputTokens,
            maxOutputTokens: limits.maxOutputTokens,
            requestsPerMinute: limits.requestsPerMinute,
        },
    };
};