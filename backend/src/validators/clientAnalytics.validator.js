import Joi from "joi";

export const analyticsRangeSchema = Joi.object({
  range: Joi.string().valid("7", "30", "90").default("7"),
});

export const conversationAnalyticsSchema = Joi.object({
  range: Joi.string().valid("7", "30", "90").default("7"),
  metric: Joi.string()
    .valid("conversations", "users")
    .default("conversations"),
});

export const recentConversationsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().allow("").max(100).default(""),
});

export const feedbackSchema = Joi.object({
  conversationId: Joi.string().hex().length(24).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().max(1000).allow("").default(""),
});

export const conversationStatusSchema = Joi.object({
  status: Joi.string()
    .valid("open", "pending", "resolved")
    .required(),
});