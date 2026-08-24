import Joi from "joi";

export const createClientValidation = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 2 characters",
    "any.required": "Full name is required",
  }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "any.required": "Password is required",
  }),

  businessName: Joi.string().trim().min(2).max(150).required(),

  businessType: Joi.string().trim().min(2).max(100).required(),

  businessDescription: Joi.string().trim().allow("").default(""),
  address: Joi.object({
    addressLine1: Joi.string().trim().max(200).allow("").default("").messages({
      "string.max": "Address line 1 cannot exceed 200 characters",
    }),

    addressLine2: Joi.string().trim().max(200).allow("").default("").messages({
      "string.max": "Address line 2 cannot exceed 200 characters",
    }),

    city: Joi.string().trim().max(100).allow("").default("").messages({
      "string.max": "City cannot exceed 100 characters",
    }),

    state: Joi.string().trim().max(100).allow("").default("").messages({
      "string.max": "State cannot exceed 100 characters",
    }),

    country: Joi.string().trim().max(100).allow("").default("").messages({
      "string.max": "Country cannot exceed 100 characters",
    }),

    postalCode: Joi.string().trim().max(20).allow("").default("").messages({
      "string.max": "Postal code cannot exceed 20 characters",
    }),

    googleMapsUrl: Joi.string().trim().uri().allow("").default("").messages({
      "string.uri": "Please enter a valid Google Maps URL",
    }),
  }).default({}),

  contact: Joi.object({
    phone: Joi.string().trim().max(20).allow("").default("").messages({
      "string.max": "Phone number cannot exceed 20 characters",
    }),

    alternatePhone: Joi.string().trim().max(20).allow("").default("").messages({
      "string.max": "Alternate phone number cannot exceed 20 characters",
    }),

    email: Joi.string()
      .trim()
      .lowercase()
      .email()
      .allow("")
      .default("")
      .messages({
        "string.email": "Please enter a valid business contact email",
      }),

    website: Joi.string().trim().uri().allow("").default("").messages({
      "string.uri": "Please enter a valid website URL",
    }),

    whatsapp: Joi.string().trim().max(20).allow("").default("").messages({
      "string.max": "WhatsApp number cannot exceed 20 characters",
    }),
  }).default({}),
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
    name: Joi.string().trim().allow("").default("AI Assistant"),

    welcomeMessage: Joi.string()
      .trim()
      .allow("")
      .default("Hi 👋 Welcome! How can I help you today?"),

    language: Joi.string()
      .valid("english", "hindi", "hinglish")
      .default("english"),

    tone: Joi.string()
      .valid("friendly", "professional", "casual", "formal")
      .default("friendly"),

    aiInstructions: Joi.string().trim().allow("").default(""),

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

export const updateClientValidation = Joi.object({
  fullName: Joi.string().trim().min(1).required().messages({
    "string.empty": "Full name is required",
    "any.required": "Full name is required",
  }),

  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),

  // Edit ke time password optional hai
  password: Joi.string().min(6).optional().allow("").messages({
    "string.min": "Password must be at least 6 characters",
  }),

  status: Joi.string().valid("active", "inactive").required().messages({
    "any.only": "Status must be active or inactive",
    "any.required": "Status is required",
  }),
  accountStatus: Joi.string().valid("active", "blocked", "deleted").required().messages({
    "any.only": "Account status must be active or inactive",
    "any.required": "Account status is required",
  }),

  businessName: Joi.string().trim().min(2).max(150).required(),

  businessType: Joi.string().trim().min(2).max(100).required(),

  businessDescription: Joi.string().max(1000).optional().allow(""),

  address: Joi.object({
    addressLine1: Joi.string().max(200).optional().allow(""),
    addressLine2: Joi.string().max(200).optional().allow(""),
    city: Joi.string().max(100).optional().allow(""),
    state: Joi.string().max(100).optional().allow(""),
    country: Joi.string().max(100).optional().allow(""),
    postalCode: Joi.string().max(20).optional().allow(""),
    googleMapsUrl: Joi.string().uri().optional().allow(""),
  }),

  contact: Joi.object({
    phone: Joi.string().trim().required(),

    alternatePhone: Joi.string().trim().optional().allow(""),

    whatsapp: Joi.string().trim().optional().allow(""),

    email: Joi.string().email().optional().allow(""),

    website: Joi.string().uri().optional().allow(""),
  }),

  clientKey: Joi.string()
    .trim()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required()
    .messages({
      "string.pattern.base":
        "Client key can contain only lowercase letters, numbers and hyphens",
    }),

  slug: Joi.string()
    .trim()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required()
    .messages({
      "string.pattern.base":
        "Slug can contain only lowercase letters, numbers and hyphens",
    }),

  chatbot: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),

    welcomeMessage: Joi.string().trim().min(2).max(500).required(),

    language: Joi.string().valid("english", "hindi", "hinglish").required(),

    tone: Joi.string()
      .valid("friendly", "professional", "casual", "formal")
      .required(),

    aiInstructions: Joi.string().max(10000).optional().allow(""),

    predefinedQuestions: Joi.array()
      .items(
        Joi.object({
          _id: Joi.string().optional(),

          question: Joi.string().trim().min(2).max(250).required(),

          enabled: Joi.boolean().default(true),

          sortOrder: Joi.number().default(0),
        }),
      )
      .required(),
  }),
});
