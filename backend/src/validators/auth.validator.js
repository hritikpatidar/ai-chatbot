import Joi from "joi";

export const signupValidation = Joi.object({
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

  password: Joi.string().min(8).max(20).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password cannot exceed 20 characters",
    "any.required": "Password is required",
  }),
  terms: Joi.boolean().valid(true).required().messages({
    "any.only": "You must accept the terms and conditions",
    "any.required": "You must accept the terms and conditions",
  }),
});

export const verifyEmailValidation = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  purpose: Joi.string().valid("register", "forgot_password").required(),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const resendOTPValidation = Joi.object({
  email: Joi.string().email().required(),
  purpose: Joi.string().valid("register", "forgot_password").required(),
});

export const forgotPasswordValidation  = Joi.object({
  email: Joi.string().email().required(),
  purpose: Joi.string().valid("register", "forgot_password").required(),
});

export const resetPasswordValidation = Joi.object({
  resetToken: Joi.string().required(),
  password: Joi.string().min(8).max(20).required()
});

export const logoutValidation = Joi.object({
  refreshToken: Joi.string().required(),
});