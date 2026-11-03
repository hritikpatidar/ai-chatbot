import mongoose from "mongoose";

import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Subscription from "../models/Subscription.js";
import Client from "../models/Client.js";


const ACTIVE_SUBSCRIPTION_STATUSES = [
    "trialing",
    "active",
    "past_due",
];

const DAY_MS = 24 * 60 * 60 * 1000;

const getAnalyticsDateRange = (range = 7) => {
    const days = [7, 30, 90].includes(Number(range))
        ? Number(range)
        : 7;

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * DAY_MS);

    const previousEndDate = new Date(startDate);
    const previousStartDate = new Date(
        previousEndDate.getTime() - days * DAY_MS
    );

    return {
        days,
        startDate,
        endDate,
        previousStartDate,
        previousEndDate,
    };
};

const getPercentageChange = (current, previous) => {
    if (previous === 0) {
        return current === 0 ? 0 : 100;
    }

    return Number(
        (((current - previous) / previous) * 100).toFixed(1)
    );
};

const getComparison = (current, previous) => ({
    current,
    previous,
    change: getPercentageChange(current, previous),
});

const getConversationMatch = (startDate, endDate) => ({
    createdAt: {
        $gte: startDate,
        $lt: endDate,
    },
    clientId: { $ne: null },
    isArchived: false,
});

const getMessageCount = async (startDate, endDate) => {
    const result = await Message.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lt: endDate,
                },
                role: { $in: ["user", "assistant"] },
                status: "completed",
            },
        },
        {
            $lookup: {
                from: Conversation.collection.name,
                localField: "conversationId",
                foreignField: "_id",
                as: "conversation",
            },
        },
        {
            $unwind: "$conversation",
        },
        {
            $match: {
                "conversation.clientId": { $ne: null },
                "conversation.isArchived": false,
            },
        },
        {
            $count: "total",
        },
    ]);

    return result[0]?.total || 0;
};

const getPeriodStats = async (startDate, endDate) => {
    const [
        totalClients,
        totalConversations,
        totalMessages,
        newSubscriptions,
    ] = await Promise.all([
        Client.countDocuments({
            createdAt: { $gte: startDate, $lt: endDate },
        }),

        Conversation.countDocuments(
            // getConversationMatch(startDate, endDate)
        ),

        getMessageCount(startDate, endDate),

        Subscription.countDocuments({
            createdAt: { $gte: startDate, $lt: endDate },
        }),
    ]);

    return {
        totalClients,
        totalConversations,
        totalMessages,
        subscriptions: newSubscriptions,
    };
};

const getCurrentClientStats = async () => {
    const [totalClients, activeClients, inactiveClients] =
        await Promise.all([
            Client.countDocuments(),

            Client.countDocuments({ status: "active" }),

            Client.countDocuments({ status: "inactive" }),
        ]);

    return {
        totalClients,
        activeClients,
        inactiveClients,
    };
};

const getCurrentSubscriptionStats = async () => {
    const [totalSubscriptions, activeSubscriptions] =
        await Promise.all([
            Subscription.countDocuments(),

            Subscription.countDocuments({
                status: { $in: ACTIVE_SUBSCRIPTION_STATUSES },
            }),
        ]);

    return {
        totalSubscriptions,
        activeSubscriptions,
        inactiveSubscriptions:
            totalSubscriptions - activeSubscriptions,
    };
};

const getEngagementStats = async (startDate, endDate) => {
    const [activeClients, engagedClients] = await Promise.all([
        Client.countDocuments({ status: "active" }),

        Conversation.distinct("clientId", {
            ...getConversationMatch(startDate, endDate),
        }),
    ]);

    const engagedCount = engagedClients.length;

    return {
        engagedClients: engagedCount,
        totalActiveClients: activeClients,
        engagementPercentage:
            activeClients > 0
                ? Number(
                    ((engagedCount / activeClients) * 100).toFixed(1)
                )
                : 0,
    };
};

const getPlatformGrowth = async () => {
    const now = new Date();

    // Current month se pichhle 7 months
    const startDate = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 7, 1)
    );

    const [clientGrowth, conversationGrowth] = await Promise.all([
        Client.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: now },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$createdAt",
                            timezone: "Asia/Kolkata",
                        },
                    },
                    count: { $sum: 1 },
                },
            },
        ]),

        Conversation.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: now },
                    clientId: { $ne: null },
                    isArchived: false,
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$createdAt",
                            timezone: "Asia/Kolkata",
                        },
                    },
                    count: { $sum: 1 },
                },
            },
        ]),
    ]);

    const clientMap = new Map(
        clientGrowth.map((item) => [item._id, item.count])
    );

    const conversationMap = new Map(
        conversationGrowth.map((item) => [item._id, item.count])
    );

    const months = [];

    for (let i = 7; i >= 0; i--) {
        const date = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)
        );

        const key = `${date.getUTCFullYear()}-${String(
            date.getUTCMonth() + 1
        ).padStart(2, "0")}`;

        months.push({
            month: date.toLocaleString("en-US", {
                month: "short",
                timeZone: "UTC",
            }),
            key,
            clients: clientMap.get(key) || 0,
            conversations: conversationMap.get(key) || 0,
        });
    }

    return months;
};

const getTopClients = async (startDate, endDate, limit = 5) => {
    const result = await Conversation.aggregate([
        {
            $match: getConversationMatch(startDate, endDate),
        },
        {
            $group: {
                _id: "$clientId",
                conversations: { $sum: 1 },
                conversationIds: { $push: "$_id" },
            },
        },
        {
            $lookup: {
                from: Message.collection.name,
                let: { ids: "$conversationIds" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $in: ["$conversationId", "$$ids"],
                            },
                            createdAt: {
                                $gte: startDate,
                                $lt: endDate,
                            },
                            status: "completed",
                        },
                    },
                    {
                        $count: "total",
                    },
                ],
                as: "messageStats",
            },
        },
        {
            $lookup: {
                from: Client.collection.name,
                localField: "_id",
                foreignField: "_id",
                as: "client",
            },
        },
        {
            $unwind: "$client",
        },
        {
            $project: {
                _id: 0,
                clientId: "$client._id",
                name: "$client.businessName",
                email: "$client.contact.email",
                status: "$client.status",
                conversations: 1,
                messages: {
                    $ifNull: [
                        { $arrayElemAt: ["$messageStats.total", 0] },
                        0,
                    ],
                },
            },
        },
        {
            $sort: {
                conversations: -1,
                messages: -1,
            },
        },
        {
            $limit: limit,
        },
    ]);

    return result;
};

export const getAdminAnalyticsService = async (range = 7) => {
    const {
        startDate,
        endDate,
        previousStartDate,
        previousEndDate,
    } = getAnalyticsDateRange(range);

    const [
        currentPeriod,
        previousPeriod,
        clientStats,
        subscriptionStats,
        engagement,
        platformGrowth,
        topClients,
    ] = await Promise.all([
        getPeriodStats(startDate, endDate),
        getPeriodStats(previousStartDate, previousEndDate),
        getCurrentClientStats(),
        getCurrentSubscriptionStats(),
        getEngagementStats(startDate, endDate),
        getPlatformGrowth(),
        getTopClients(startDate, endDate, 5),
    ]);

    const activeChatbots = clientStats.activeClients;
    return {
        range: Number(range),

        stats: {
            totalClients: {
                value: currentPeriod.totalClients,
                comparison: getComparison(
                    currentPeriod.totalClients,
                    previousPeriod.totalClients
                ),
            },

            activeClients: {
                value: clientStats.activeClients,
            },

            inactiveClients: {
                value: clientStats.inactiveClients,
            },

            totalConversations: {
                value: currentPeriod.totalConversations,
                comparison: getComparison(
                    currentPeriod.totalConversations,
                    previousPeriod.totalConversations
                ),
            },

            totalMessages: {
                value: currentPeriod.totalMessages,
                comparison: getComparison(
                    currentPeriod.totalMessages,
                    previousPeriod.totalMessages
                ),
            },

            activeChatbots: {
                value: activeChatbots,
                isEstimated: true,
            },

            subscriptions: {
                value: subscriptionStats.activeSubscriptions,
                total: subscriptionStats.totalSubscriptions,
                inactive: subscriptionStats.inactiveSubscriptions,
                comparison: getComparison(
                    currentPeriod.subscriptions,
                    previousPeriod.subscriptions
                ),
                comparisonLabel: "New subscriptions",
            },

            engagement: {
                value: engagement.engagementPercentage,
                engagedClients: engagement.engagedClients,
                totalActiveClients: engagement.totalActiveClients,
            },
        },

        platformGrowth,

        clientDistribution: {
            total: clientStats.totalClients,
            active: clientStats.activeClients,
            inactive: clientStats.inactiveClients,
            activePercentage:
                clientStats.totalClients > 0
                    ? Number(
                        (
                            (clientStats.activeClients /
                                clientStats.totalClients) *
                            100
                        ).toFixed(1)
                    )
                    : 0,
            inactivePercentage:
                clientStats.totalClients > 0
                    ? Number(
                        (
                            (clientStats.inactiveClients /
                                clientStats.totalClients) *
                            100
                        ).toFixed(1)
                    )
                    : 0,
        },

        topClients,
    };
};