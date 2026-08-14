import Joi from "joi";

export const createClientValidation = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Full name is required",
      "string.min": "Full name must be at least 2 characters",
      "any.required": "Full name is required",
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(8)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "any.required": "Password is required",
    }),

  businessName: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .required(),

  businessType: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  businessDescription: Joi.string()
    .trim()
    .allow("")
    .default(""),

  clientKey: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Client key can only contain lowercase letters, numbers and hyphens",
    }),

  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .required(),

  chatbot: Joi.object({
    name: Joi.string()
      .trim()
      .allow("")
      .default("AI Assistant"),

    welcomeMessage: Joi.string()
      .trim()
      .allow("")
      .default("Hi 👋 Welcome! How can I help you today?"),

    language: Joi.string()
      .valid("english", "hindi", "hinglish")
      .default("english"),

    tone: Joi.string()
      .valid(
        "friendly",
        "professional",
        "casual",
        "formal",
      )
      .default("friendly"),

    aiInstructions: Joi.string()
      .trim()
      .allow("")
      .default(""),

    predefinedQuestions: Joi.array()
      .items(
        Joi.object({
          question: Joi.string().trim().required(),

          enabled: Joi.boolean().default(true),

          sortOrder: Joi.number().default(0),
        }),
      )
      .default([]),
  }).default({}),
});