import Joi from "joi";

export const widgetIdentifyValidation = Joi.object({
  clientKey: Joi.string().trim().required().messages({
    "string.empty": "Client key is required",
    "any.required": "Client key is required",
  }),

  guestId: Joi.string().trim().required().messages({
    "string.empty": "Guest id is required",
    "any.required": "Guest id is required",
  }),

  fullName: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 2 characters",
    "string.max": "Full name cannot exceed 100 characters",
    "any.required": "Full name is required",
  }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),

  phone: Joi.optional(),
});