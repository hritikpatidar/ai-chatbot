import { Socket } from "socket.io";
import SubscriptionUsage from "../models/SubscriptionUsage.js";

const getCurrentMonthStart = () => {
  const now = new Date();

  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  );
};

const getOrCreateUsage = async ({ subscription, clientId }) => {
  const periodStart = getCurrentMonthStart();

  try {
    await SubscriptionUsage.updateOne(
      {
        subscriptionId: subscription._id,
        periodStart,
      },
      {
        $setOnInsert: {
          subscriptionId: subscription._id,
          clientId,
          periodStart,
        },
      },
      { upsert: true }
    );
  } catch (error) {
    // Concurrent first requests can create a duplicate-key race.
    if (error.code !== 11000) throw error;
  }

  const usage = await SubscriptionUsage.findOne({
    subscriptionId: subscription._id,
    periodStart,
  }).lean();

  if (!usage) {
    throw new Error("USAGE_RECORD_NOT_FOUND");
  }

  return usage;
};

export const reserveAIUsage = async ({
  subscription,
  plan,
  clientId,
}) => {
  const limits = plan?.limits;

  if (
    !limits ||
    !Number.isFinite(limits.monthlyResponses) ||
    !Number.isFinite(limits.monthlyTokenBudget) ||
    !Number.isFinite(limits.maxInputTokens) ||
    !Number.isFinite(limits.maxOutputTokens)
  ) {
    Socket.emit("ai:error", {
      success: false,
      code: "USAGE_VALIDATION_FAILED",
      message: "Client subscription not found. Please try again.",
    });
    return;
  }

  const usage = await getOrCreateUsage({
    subscription,
    clientId,
  });

  // Reserve room for classifier + final response.
  // Input size must also be bounded in ai.service.js.
  const reservedTokens =
    limits.maxInputTokens * 2 +
    limits.maxOutputTokens +
    100;

  const updated = await SubscriptionUsage.findOneAndUpdate(
    {
      _id: usage._id,
      $expr: {
        $and: [
          {
            $lt: [
              { $add: ["$responsesUsed", "$responsesReserved"] },
              limits.monthlyResponses,
            ],
          },
          {
            $lte: [
              {
                $add: [
                  "$tokensUsed",
                  "$tokensReserved",
                  reservedTokens,
                ],
              },
              limits.monthlyTokenBudget,
            ],
          },
        ],
      },
    },
    {
      $inc: {
        responsesReserved: 1,
        tokensReserved: reservedTokens,
      },
    },
    { new: true }
  );

  if (!updated) {
    const latest = await SubscriptionUsage.findById(usage._id).lean();

    if (
      latest &&
      latest.responsesUsed + latest.responsesReserved >=
      limits.monthlyResponses
    ) {
      throw new Error("MONTHLY_RESPONSE_LIMIT_REACHED");
    }

    throw new Error("MONTHLY_TOKEN_LIMIT_REACHED");
  }

  return {
    usageId: updated._id,
    reservedTokens,
  };
};

export const completeAIUsage = async ({
  usageId,
  reservedTokens,
  actualTokens,
}) => {
  const tokens = Math.max(0, Math.floor(Number(actualTokens) || 0));

  const result = await SubscriptionUsage.updateOne(
    {
      _id: usageId,
      responsesReserved: { $gte: 1 },
      tokensReserved: { $gte: reservedTokens },
    },
    {
      $inc: {
        responsesReserved: -1,
        tokensReserved: -reservedTokens,
        responsesUsed: 1,
        tokensUsed: tokens,
      },
    }
  );

  if (result.modifiedCount !== 1) {
    throw new Error("AI_USAGE_RESERVATION_NOT_FOUND");
  }
};

export const releaseAIUsage = async ({
  usageId,
  reservedTokens,
}) => {
  const result = await SubscriptionUsage.updateOne(
    {
      _id: usageId,
      responsesReserved: { $gte: 1 },
      tokensReserved: { $gte: reservedTokens },
    },
    {
      $inc: {
        responsesReserved: -1,
        tokensReserved: -reservedTokens,
      },
    }
  );

  if (result.modifiedCount !== 1) {
    console.warn("AI usage reservation was not released", { usageId });
  }
};


export const reserveConversationCreation = async ({
  subscription,
  plan,
  clientId,
}) => {
  const limit = plan?.limits?.monthlyConversations;

  if (!Number.isFinite(limit) || limit < 0) {
    throw new Error("SUBSCRIPTION_PLAN_LIMITS_NOT_CONFIGURED");
  }

  const usage = await getOrCreateUsage({
    subscription,
    clientId,
  });

  const updated = await SubscriptionUsage.findOneAndUpdate(
    {
      _id: usage._id,
      $expr: {
        $lt: [
          {
            $add: [
              { $ifNull: ["$conversationsUsed", 0] },
              { $ifNull: ["$conversationsReserved", 0] },
            ],
          },
          limit,
        ],
      },
    },
    {
      $inc: {
        conversationsReserved: 1,
      },
    },
    { new: true }
  );

  if (!updated) {
    throw new Error("MONTHLY_CONVERSATION_LIMIT_REACHED");
  }

  return { usageId: updated._id };
};

export const completeConversationCreation = async ({
  usageId,
}) => {
  const result = await SubscriptionUsage.updateOne(
    {
      _id: usageId,
      conversationsReserved: { $gte: 1 },
    },
    {
      $inc: {
        conversationsReserved: -1,
        conversationsUsed: 1,
      },
    }
  );

  if (result.modifiedCount !== 1) {
    throw new Error("CONVERSATION_RESERVATION_NOT_FOUND");
  }
};

export const releaseConversationCreation = async ({
  usageId,
}) => {
  const result = await SubscriptionUsage.updateOne(
    {
      _id: usageId,
      conversationsReserved: { $gte: 1 },
    },
    {
      $inc: {
        conversationsReserved: -1,
      },
    }
  );

  if (result.modifiedCount !== 1) {
    console.warn(
      "Conversation reservation was not released",
      { usageId }
    );
  }
};