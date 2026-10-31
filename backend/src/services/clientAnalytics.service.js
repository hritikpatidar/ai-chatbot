import mongoose from "mongoose";

import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import WidgetVisitor from "../models/WidgetVisitor.js";
import ConversationFeedback from "../models/ConversationFeedback.js";

const getDateRange = (range) => {
    const days = Number(range) || 7;

    const endDate = new Date();
    const startDate = new Date();

    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    return { startDate, endDate, days };
};

const getDayLabel = (date, days) => {
    if (days <= 7) {
        return date.toLocaleDateString("en-US", {
            weekday: "short",
        });
    }

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
    });
};

const getClientFilter = (clientId, startDate, endDate) => ({
    clientId: new mongoose.Types.ObjectId(clientId),
    createdAt: {
        $gte: startDate,
        $lte: endDate,
    },
});

// 1. OVERVIEW
export const getOverviewService = async (clientId, range) => {
    const { startDate, endDate, days } = getDateRange(range);

    const previousStart = new Date(startDate);
    previousStart.setDate(previousStart.getDate() - days);

    const clientObjectId = new mongoose.Types.ObjectId(clientId);

    const currentFilter = getClientFilter(
        clientId,
        startDate,
        endDate
    );

    const previousFilter = {
        ...getClientFilter(clientId, previousStart, startDate),
        createdAt: {
            $gte: previousStart,
            $lt: startDate,
        },
    };

    // Calculate average response time for a period
    const getAverageResponseTime = async (periodStart, periodEnd) => {
        const messages = await Message.aggregate([
            {
                $match: {
                    role: "assistant",
                    status: "completed",
                    createdAt: {
                        $gte: periodStart,
                        $lte: periodEnd,
                    },
                    replyToMessageId: { $ne: null },
                },
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "replyToMessageId",
                    foreignField: "_id",
                    as: "userMessage",
                },
            },
            {
                $unwind: "$userMessage",
            },
            {
                $match: {
                    "userMessage.role": "user",
                },
            },
            {
                $lookup: {
                    from: "conversations",
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
                    "conversation.clientId": clientObjectId,
                },
            },
            {
                $project: {
                    responseTime: {
                        $subtract: [
                            "$createdAt",
                            "$userMessage.createdAt",
                        ],
                    },
                },
            },
            {
                $match: {
                    responseTime: { $gte: 0 },
                },
            },
            {
                $group: {
                    _id: null,
                    totalResponseTime: {
                        $sum: "$responseTime",
                    },
                    totalResponses: {
                        $sum: 1,
                    },
                },
            },
        ]);

        if (!messages.length || !messages[0].totalResponses) {
            return 0;
        }

        // Milliseconds to seconds
        return Number(
            (
                messages[0].totalResponseTime /
                messages[0].totalResponses /
                1000
            ).toFixed(2)
        );
    };

    // Fetch current and previous period data
    const [
        totalConversations,
        previousConversations,

        currentUserIds,
        currentGuestIds,

        previousUserIds,
        previousGuestIds,

        resolvedCount,
        previousResolvedCount,

        avgResponseTime,
        previousAvgResponseTime,
    ] = await Promise.all([
        // Conversations
        Conversation.countDocuments(currentFilter),
        Conversation.countDocuments(previousFilter),
        // Current unique users
        Conversation.distinct("userId", {
            ...currentFilter,
            userId: { $ne: null },
        }),
        Conversation.distinct("guestId", {
            ...currentFilter,
            guestId: { $nin: [null, ""] },
        }),
        // Previous unique users
        Conversation.distinct("userId", {
            ...previousFilter,
            userId: { $ne: null },
        }),
        Conversation.distinct("guestId", {
            ...previousFilter,
            guestId: { $nin: [null, ""] },
        }),
        // Resolution count
        Conversation.countDocuments({
            ...currentFilter,
            status: "resolved",
        }),
        Conversation.countDocuments({
            ...previousFilter,
            status: "resolved",
        }),
        // Average response time
        getAverageResponseTime(startDate, endDate),

        getAverageResponseTime(previousStart, startDate),
    ]);

    // Unique users count
    const getUniqueUserCount = (userIds, guestIds) => {
        const identities = new Set();
        userIds.forEach((id) => {
            if (id) identities.add(`user:${id.toString()}`);
        });
        guestIds.forEach((id) => {
            if (id) identities.add(`guest:${id}`);
        });
        return identities.size;
    };

    const uniqueUsers = getUniqueUserCount(
        currentUserIds,
        currentGuestIds
    );

    const previousUniqueUsers = getUniqueUserCount(
        previousUserIds,
        previousGuestIds
    );

    // Resolution rate
    const resolutionRate =
        totalConversations > 0
            ? (resolvedCount / totalConversations) * 100
            : 0;

    const previousResolutionRate =
        previousConversations > 0
            ? (previousResolvedCount / previousConversations) * 100
            : 0;

    return {
        totalConversations,
        uniqueUsers,
        avgResponseTime,
        resolutionRate: Number(resolutionRate.toFixed(2)),
        comparison: {
            conversations: {
                current: totalConversations,
                previous: previousConversations,
            },
            uniqueUsers: {
                current: uniqueUsers,
                previous: previousUniqueUsers,
            },
            avgResponseTime: {
                current: avgResponseTime,
                previous: previousAvgResponseTime,
            },
            resolutionRate: {
                current: Number(resolutionRate.toFixed(2)),
                previous: Number(previousResolutionRate.toFixed(2)),
            },
        },
    };
};

// 2. CONVERSATIONS OVERVIEW
export const getConversationsChartService = async (
    clientId,
    range,
    metric,
) => {
    const { startDate, endDate, days } = getDateRange(range);

    const conversations = await Conversation.aggregate([
        {
            $match: getClientFilter(clientId, startDate, endDate),
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt",
                        timezone: "Asia/Kolkata",
                    },
                },
                conversations: { $sum: 1 },
                users: {
                    $addToSet: {
                        $cond: [
                            { $ne: ["$userId", null] },
                            { $toString: "$userId" },
                            {
                                $cond: [
                                    { $ne: ["$guestId", null] },
                                    "$guestId",
                                    null,
                                ],
                            },
                        ],
                    },
                },
            },
        },
        {
            $project: {
                _id: 1,
                conversations: 1,
                users: {
                    $size: {
                        $filter: {
                            input: "$users",
                            as: "user",
                            cond: { $ne: ["$$user", null] },
                        },
                    },
                },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    const dataMap = new Map(
        conversations.map((item) => [item._id, item]),
    );

    const result = [];

    // IST date formatter - avoids UTC date shifting
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);

        date.setDate(date.getDate() + i);

        const key = formatDate(date);
        const item = dataMap.get(key);

        result.push({
            date: key,
            day: getDayLabel(date, days),
            conversations: item?.conversations || 0,
            users: item?.users || 0,
            value:
                metric === "users"
                    ? item?.users || 0
                    : item?.conversations || 0,
        });
    }

    return result;
};

// 3. USER ACTIVITY
export const getUserActivityService = async (clientId, range) => {
    const { startDate, endDate } = getDateRange(range);

    const days = Number(range);

    // Local date formatter (server timezone should be Asia/Kolkata)
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const conversations = await Conversation.find({
        clientId,
        createdAt: { $lte: endDate },
    })
        .select("userId guestId createdAt")
        .sort({ createdAt: 1 })
        .lean();

    const firstSeen = new Map();

    // Find each user's first conversation
    for (const conversation of conversations) {
        const identity = conversation.userId
            ? `user:${conversation.userId}`
            : conversation.guestId
                ? `guest:${conversation.guestId}`
                : null;

        if (!identity) continue;

        if (!firstSeen.has(identity)) {
            firstSeen.set(identity, conversation.createdAt);
        }
    }

    // Initialize daily data
    const daily = new Map();

    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);

        date.setDate(date.getDate() + i);

        const key = formatDate(date);

        daily.set(key, {
            date: key,
            day: getDayLabel(date, days),
            newUsers: 0,
            returningUsers: 0,
        });
    }

    // Calculate new users
    for (const [identity, firstDate] of firstSeen.entries()) {
        if (firstDate < startDate || firstDate > endDate) continue;

        const key = formatDate(new Date(firstDate));
        const item = daily.get(key);

        if (item) {
            item.newUsers++;
        }
    }

    // Filter conversations in selected date range
    const currentConversations = conversations.filter(
        (item) =>
            item.createdAt >= startDate &&
            item.createdAt <= endDate
    );

    const returningByDay = new Map();

    // Calculate returning users
    for (const conversation of currentConversations) {
        const identity = conversation.userId
            ? `user:${conversation.userId}`
            : conversation.guestId
                ? `guest:${conversation.guestId}`
                : null;

        if (!identity) continue;

        const firstDate = firstSeen.get(identity);

        if (firstDate && firstDate < startDate) {
            const key = formatDate(new Date(conversation.createdAt));

            if (!returningByDay.has(key)) {
                returningByDay.set(key, new Set());
            }

            returningByDay.get(key).add(identity);
        }
    }

    // Assign returning users to daily data
    for (const [key, users] of returningByDay.entries()) {
        const item = daily.get(key);

        if (item) {
            item.returningUsers = users.size;
        }
    }

    return Array.from(daily.values());
};

// 4. CONVERSATION SOURCES
export const getSourcesService = async (clientId, range) => {
    const { startDate, endDate } = getDateRange(range);

    const data = await Conversation.aggregate([
        {
            $match: getClientFilter(clientId, startDate, endDate),
        },
        {
            $group: {
                _id: { $ifNull: ["$source", "other"] },
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
    ]);

    const total = data.reduce((sum, item) => sum + item.count, 0);

    const sourceData = {
        data: data.map((item) => ({
            name: item._id,
            count: item.count,
            value: total
                ? Number(((item.count / total) * 100).toFixed(2))
                : 0,
        })),
        totalConversations: total
    }
    return sourceData
};

// 5. POPULAR TOPICS
export const getTopicsService = async (clientId, range) => {
    const { startDate, endDate } = getDateRange(range);
    const data = await Conversation.aggregate([
        {
            $match: getClientFilter(clientId, startDate, endDate),
        },
        {
            $group: {
                _id: { $ifNull: ["$topic", "other"] },
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
    ]);

    return data.map((item) => ({
        topic: item._id,
        count: item.count,
    }));
};

// 6. USER SATISFACTION
export const getSatisfactionService = async (clientId, range) => {
    const { startDate, endDate } = getDateRange(range);

    const feedback = await ConversationFeedback.aggregate([
        {
            $match: {
                clientId: new mongoose.Types.ObjectId(clientId),
                createdAt: { $gte: startDate, $lte: endDate },
                rating: { $gte: 1, $lte: 4 },
            },
        },
        {
            $group: {
                _id: "$rating",
                count: { $sum: 1 },
            },
        },
    ]);

    const totalReviews = feedback.reduce(
        (sum, item) => sum + item.count,
        0
    );

    const totalScore = feedback.reduce(
        (sum, item) => sum + item._id * item.count,
        0
    );

    const ratingLabels = {
        4: { label: "Excellent", color: "bg-emerald-500" },
        3: { label: "Good", color: "bg-blue-500" },
        2: { label: "Average", color: "bg-amber-400" },
        1: { label: "Poor", color: "bg-rose-500" },
    };

    const ratingDistribution = [4, 3, 2, 1].map((rating) => {
        const item = feedback.find((entry) => entry._id === rating);
        const count = item?.count || 0;

        return {
            label: ratingLabels[rating].label,
            value: totalReviews
                ? Number(((count / totalReviews) * 100).toFixed(2))
                : 0,
            color: ratingLabels[rating].color,
        };
    });

    return {
        totalReviews,
        averageRating: totalReviews
            ? Number((totalScore / totalReviews).toFixed(2))
            : 0,
        ratingDistribution,
    };
};
