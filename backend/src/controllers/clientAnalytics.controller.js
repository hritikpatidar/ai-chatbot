import * as analyticsService from "../services/clientAnalytics.service.js";

import {
  analyticsRangeSchema,
  conversationAnalyticsSchema,
  recentConversationsSchema,
  feedbackSchema,
  conversationStatusSchema,
} from "../validators/clientAnalytics.validator.js";

const getClientId = (req) => {
  // Client user ke JWT mein clientId ho to use karo.
  // Agar JWT client account ka hi hai, to id fallback hai.
  return req.user?.clientId;
};

const validate = (schema, data, res) => {
  const { error, value } = schema.validate(data, {
    abortEarly: true,
    stripUnknown: true,
  });

  if (error) {
    res.status(400).json({
      success: false,
      message: error.details[0].message,
    });

    return null;
  }

  return value;
};

const handleError = (res, error) => {
  console.error("Client Analytics Error:", error);

  const status = error.message === "Conversation not found" ? 404 : 500;

  return res.status(status).json({
    success: false,
    message: error.message || "Something went wrong",
  });
};

// Overview
export const getAnalyticsOverview = async (req, res) => {
  try {
    const clientId = getClientId(req);

    if (!clientId) {
      return res.status(403).json({
        success: false,
        message: "Client access required",
      });
    }

    const query = validate(analyticsRangeSchema, req.query, res);
    if (!query) return;

    const data = await analyticsService.getOverviewService(
      clientId,
      query.range,
    );

    return res.status(200).json({
      success: true,
      message: "Analytics overview fetched successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Conversations Chart
export const getConversationsChart = async (req, res) => {
  try {
    const clientId = getClientId(req);

    if (!clientId) {
      return res.status(403).json({
        success: false,
        message: "Client access required",
      });
    }

    const query = validate(
      conversationAnalyticsSchema,
      req.query,
      res,
    );

    if (!query) return;

    const data = await analyticsService.getConversationsChartService(
      clientId,
      query.range,
      query.metric,
    );

    return res.status(200).json({
      success: true,
      message: "Conversations analytics fetched successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// User Activity
export const getUserActivity = async (req, res) => {
  try {
    const clientId = getClientId(req);

    if (!clientId) {
      return res.status(403).json({
        success: false,
        message: "Client access required",
      });
    }

    const query = validate(analyticsRangeSchema, req.query, res);
    if (!query) return;

    const data = await analyticsService.getUserActivityService(
      clientId,
      query.range,
    );

    return res.status(200).json({
      success: true,
      message: "User activity fetched successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Sources
export const getConversationSources = async (req, res) => {
  try {
    const clientId = getClientId(req);

    if (!clientId) {
      return res.status(403).json({
        success: false,
        message: "Client access required",
      });
    }

    const query = validate(analyticsRangeSchema, req.query, res);
    if (!query) return;

    const data = await analyticsService.getSourcesService(
      clientId,
      query.range,
    );

    return res.status(200).json({
      success: true,
      message: "Conversation sources fetched successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Popular Topics
export const getPopularTopics = async (req, res) => {
  try {
    const clientId = getClientId(req);

    if (!clientId) {
      return res.status(403).json({
        success: false,
        message: "Client access required",
      });
    }

    const query = validate(analyticsRangeSchema, req.query, res);
    if (!query) return;

    const data = await analyticsService.getTopicsService(
      clientId,
      query.range,
    );

    return res.status(200).json({
      success: true,
      message: "Popular topics fetched successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Satisfaction
export const getUserSatisfaction = async (req, res) => {
  try {
    const clientId = getClientId(req);

    if (!clientId) {
      return res.status(403).json({
        success: false,
        message: "Client access required",
      });
    }

    const query = validate(analyticsRangeSchema, req.query, res);
    if (!query) return;

    const data = await analyticsService.getSatisfactionService(
      clientId,
      query.range,
    );

    return res.status(200).json({
      success: true,
      message: "User satisfaction fetched successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Recent Conversations
export const getRecentConversations = async (req, res) => {
  try {
    const clientId = getClientId(req);

    if (!clientId) {
      return res.status(403).json({
        success: false,
        message: "Client access required",
      });
    }

    const query = validate(recentConversationsSchema, req.query, res);
    if (!query) return;

    const data = await analyticsService.getRecentConversationsService(
      clientId,
      query,
    );

    return res.status(200).json({
      success: true,
      message: "Recent conversations fetched successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

