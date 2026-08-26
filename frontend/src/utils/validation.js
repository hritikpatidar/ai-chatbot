import z from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

const validatePhoneNumber = (value) => {
  if (!value || !value.trim()) {
    return true;
  }

  try {
    const phone = value.trim();
    // Agar + already hai to dobara add nahi karna
    const normalizedPhone = phone.startsWith("+") ? phone : `+${phone}`;

    return isValidPhoneNumber(normalizedPhone);
  } catch {
    return false;
  }
};

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-]).{8,16}$/;

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .regex(/^[a-zA-Z\s]+$/, "Full name should contain only letters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(1, "Password is required")
      .regex(
        passwordRegex,
        "Password must contain uppercase, lowercase, number and special character",
      ),

    confirmPassword: z.string().min(1, "Confirm password is required"),

    terms: z.boolean().refine((val) => val === true, {
      message: "Please accept Terms & Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z.string().trim().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain one uppercase letter")
      .regex(/[a-z]/, "Must contain one lowercase letter")
      .regex(/[0-9]/, "Must contain one number")
      .regex(/[@$!%*?&]/, "Must contain one special character"),

    confirmPassword: z.string().trim().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const editProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  email: z.string().trim().email("Please enter a valid email address"),

  profileImage: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return file instanceof File;
      },
      {
        message: "Please select a valid image",
      },
    )
    .refine(
      (file) => {
        if (!file) return true;

        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];

        return allowedTypes.includes(file.type);
      },
      {
        message: "Only JPG, PNG or WEBP images are allowed",
      },
    )
    .refine(
      (file) => {
        if (!file) return true;

        return file.size <= 2 * 1024 * 1024;
      },
      {
        message: "Image size must be less than 2MB",
      },
    ),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase and number",
      ),

    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const imageSchema = z
  .any()
  .nullable()
  .optional()
  .refine(
    (file) => {
      if (!file) return true;
      return file instanceof File;
    },
    {
      message: "Please select a valid image",
    },
  )
  .refine(
    (file) => {
      if (!file) return true;

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      return allowedTypes.includes(file.type);
    },
    {
      message: "Only JPG, PNG or WEBP images are allowed",
    },
  )
  .refine(
    (file) => {
      if (!file) return true;

      return file.size <= 5 * 1024 * 1024;
    },
    {
      message: "Image size must be less than 5MB",
    },
  );

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(150, "Product name cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),

  category: z
    .string()
    .trim()
    .max(100, "Category cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),

  price: z.union([z.string(), z.number()]).refine(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return true;
      }

      return Number(value) >= 0;
    },
    {
      message: "Price cannot be negative",
    },
  ),

  currency: z.enum(["INR", "USD", "GBP", "EUR"]),

  availability: z.enum([
    "in_stock",
    "out_of_stock",
    "pre_order",
    "unavailable",
  ]),

  stock: z.union([z.string(), z.number()]).refine(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return true;
      }

      return Number.isInteger(Number(value)) && Number(value) >= 0;
    },
    {
      message: "Stock must be a valid non-negative number",
    },
  ),

  image: imageSchema,

  status: z.enum(["active", "inactive"]),

  metadata: z
    .array(
      z.object({
        key: z.string().trim().min(1, "Please select a metadata key"),

        value: z.string().trim().min(1, "Metadata value is required"),
      }),
    )
    .default([]),
});

export const faqSchema = z.object({
  question: z
    .string()
    .trim()
    .min(2, "Question must be at least 2 characters")
    .max(250, "Question cannot exceed 250 characters"),

  answer: z
    .string()
    .trim()
    .min(2, "Answer must be at least 2 characters")
    .max(3000, "Answer cannot exceed 3000 characters"),

  category: z
    .string()
    .trim()
    .max(100, "Category cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),

  keywords: z
    .string()
    .trim()
    .max(500, "Keywords cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),

  status: z.enum(["active", "inactive"]),
});

export const ticketSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(150, "Subject cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(2000, "Description cannot exceed 2000 characters"),

  status: z.enum(["open", "in_progress", "resolved", "closed"]),

  priority: z.enum(["low", "medium", "high"]),
});

const requiredPhoneField = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .refine(validatePhoneNumber, {
    message: "Please enter a valid phone number",
  });

const optionalPhoneField = z.string().trim();

export const predefinedQuestionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(2, "Question must be at least 2 characters")
    .max(250, "Question cannot exceed 250 characters"),

  enabled: z.boolean().default(true),

  sortOrder: z.coerce.number().default(0),
});

export const formSchema = z.object({
  /* BUSINESS */
  businessName: z
    .string()
    .trim()
    .min(2, "Business name is required")
    .max(150, "Business name cannot exceed 150 characters"),
  businessType: z
    .string()
    .trim()
    .min(2, "Business type is required")
    .max(100, "Business type cannot exceed 100 characters"),
  businessDescription: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),

  /* ADDRESS */
  address: z.object({
    addressLine1: z.string().max(200).optional().or(z.literal("")),
    addressLine2: z.string().max(200).optional().or(z.literal("")),
    city: z.string().max(100).optional().or(z.literal("")),
    state: z.string().max(100).optional().or(z.literal("")),
    country: z.string().max(100).optional().or(z.literal("")),
    postalCode: z.string().max(20).optional().or(z.literal("")),
    googleMapsUrl: z
      .string()
      .url("Please enter a valid Google Maps URL")
      .optional()
      .or(z.literal("")),
  }),

  /* CONTACT */
  contact: z.object({
    phone: requiredPhoneField,
    alternatePhone: optionalPhoneField,
    whatsapp: optionalPhoneField,
    email: z
      .string()
      .email("Please enter a valid email")
      .optional()
      .or(z.literal("")),
    website: z
      .string()
      .url("Please enter a valid website URL")
      .optional()
      .or(z.literal("")),
  }),

  /* CHATBOT */
  chatbot: z.object({
    name: z.string().trim().min(2, "Bot name is required").max(100),
    welcomeMessage: z
      .string()
      .trim()
      .min(2, "Welcome message is required")
      .max(500),
    language: z.enum(["english", "hindi", "hinglish"]),
    tone: z.enum(["friendly", "professional", "casual", "formal"]),
    aiInstructions: z
      .string()
      .max(10000, "AI instructions cannot exceed 3000 characters")
      .optional()
      .or(z.literal("")),
    predefinedQuestions: z.array(predefinedQuestionSchema),
  }),

  status: z.enum(["active", "inactive"]),
});

// export const clientSchema = z.object({
//   fullName: z.string().trim().min(1, "Full name is required"),
//   email: z.string().trim().email("Please enter a valid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   status: z.enum(["active", "inactive"]),
//   businessName: z
//     .string()
//     .trim()
//     .min(2, "Business name is required")
//     .max(150, "Business name cannot exceed 150 characters"),
//   businessType: z
//     .string()
//     .trim()
//     .min(2, "Business type is required")
//     .max(100, "Business type cannot exceed 100 characters"),
//   businessDescription: z
//     .string()
//     .max(1000, "Description cannot exceed 1000 characters")
//     .optional()
//     .or(z.literal("")),
//   address: z.object({
//     addressLine1: z.string().max(200).optional().or(z.literal("")),
//     addressLine2: z.string().max(200).optional().or(z.literal("")),
//     city: z.string().max(100).optional().or(z.literal("")),
//     state: z.string().max(100).optional().or(z.literal("")),
//     country: z.string().max(100).optional().or(z.literal("")),
//     postalCode: z.string().max(20).optional().or(z.literal("")),
//     googleMapsUrl: z
//       .string()
//       .url("Please enter a valid Google Maps URL")
//       .optional()
//       .or(z.literal("")),
//   }),

//   contact: z.object({
//     phone: requiredPhoneField,
//     alternatePhone: optionalPhoneField,
//     whatsapp: optionalPhoneField,
//     email: z
//       .string()
//       .email("Please enter a valid email")
//       .optional()
//       .or(z.literal("")),
//     website: z
//       .string()
//       .url("Please enter a valid website URL")
//       .optional()
//       .or(z.literal("")),
//   }),

//   clientKey: z
//     .string()
//     .trim()
//     .min(1, "Client key is required")
//     .regex(
//       /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
//       "Client key can contain only lowercase letters, numbers and hyphens",
//     ),

//   slug: z
//     .string()
//     .trim()
//     .min(1, "Slug is required")
//     .regex(
//       /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
//       "Slug can contain only lowercase letters, numbers and hyphens",
//     ),

//   chatbot: z.object({
//     name: z.string().trim().min(2, "Chatbot name is required").max(100),
//     welcomeMessage: z
//       .string()
//       .trim()
//       .min(2, "Welcome message is required")
//       .max(500),
//     language: z.enum(["english", "hindi", "hinglish"]),
//     tone: z.enum(["friendly", "professional", "casual", "formal"]),
//     aiInstructions: z
//       .string()
//       .max(10000, "AI instructions cannot exceed 3000 characters")
//       .optional()
//       .or(z.literal("")),
//     predefinedQuestions: z.array(predefinedQuestionSchema),
//   }),
// });

const baseClientSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Please enter a valid email address"),
  status: z.enum(["active", "inactive"]),
  businessName: z
    .string()
    .trim()
    .min(2, "Business name is required")
    .max(150, "Business name cannot exceed 150 characters"),

  businessName: z
    .string()
    .trim()
    .min(2, "Business name is required")
    .max(150, "Business name cannot exceed 150 characters"),
  businessType: z
    .string()
    .trim()
    .min(2, "Business type is required")
    .max(100, "Business type cannot exceed 100 characters"),
  businessDescription: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
  address: z.object({
    addressLine1: z.string().max(200).optional().or(z.literal("")),
    addressLine2: z.string().max(200).optional().or(z.literal("")),
    city: z.string().max(100).optional().or(z.literal("")),
    state: z.string().max(100).optional().or(z.literal("")),
    country: z.string().max(100).optional().or(z.literal("")),
    postalCode: z.string().max(20).optional().or(z.literal("")),
    googleMapsUrl: z
      .string()
      .url("Please enter a valid Google Maps URL")
      .optional()
      .or(z.literal("")),
  }),

  contact: z.object({
    phone: requiredPhoneField,
    alternatePhone: optionalPhoneField,
    whatsapp: optionalPhoneField,
    email: z
      .string()
      .email("Please enter a valid email")
      .optional()
      .or(z.literal("")),
    website: z
      .string()
      .url("Please enter a valid website URL")
      .optional()
      .or(z.literal("")),
  }),

  clientKey: z
    .string()
    .trim()
    .min(1, "Client key is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Client key can contain only lowercase letters, numbers and hyphens",
    ),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can contain only lowercase letters, numbers and hyphens",
    ),

  chatbot: z.object({
    name: z.string().trim().min(2, "Chatbot name is required").max(100),
    welcomeMessage: z
      .string()
      .trim()
      .min(2, "Welcome message is required")
      .max(500),
    language: z.enum(["english", "hindi", "hinglish"]),
    tone: z.enum(["friendly", "professional", "casual", "formal"]),
    aiInstructions: z
      .string()
      .max(10000, "AI instructions cannot exceed 3000 characters")
      .optional()
      .or(z.literal("")),
    predefinedQuestions: z.array(predefinedQuestionSchema),
  }),
});

export const clientSchema = baseClientSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const editClientSchema = baseClientSchema.extend({
  password: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || value.length >= 6,
      "Password must be at least 6 characters",
    ),
  accountStatus: z.enum(["active", "blocked"]),
});

export const subscriptionPlanValidation = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Plan name must be at least 2 characters")
    .max(50, "Plan name must not exceed 50 characters"),

  description: z
    .string()
    .trim()
    .max(300, "Description must not exceed 300 characters")
    .optional()
    .or(z.literal("")),

  stripePriceId: z
    .string()
    .trim()
    .min(1, "Stripe Price ID is required")
    .regex(/^price_/, "Invalid Stripe Price ID"),

  stripeProductId: z
    .string()
    .trim()
    .min(1, "Stripe Product ID is required")
    .regex(/^prod_/, "Invalid Stripe Product ID"),

  amount: z
    .number({
      message: "Amount is required",
    })
    .min(0, "Amount cannot be negative"),

  currency: z
    .string()
    .trim()
    .min(3, "Currency is required")
    .max(3, "Currency must be 3 characters")
    .transform((value) => value.toLowerCase()),

  interval: z.enum(["month", "year"], {
    message: "Billing interval is required",
  }),

  features: z
    .array(z.string().trim().min(1, "Feature cannot be empty"))
    .default([]),

  sortOrder: z
    .number({
      message: "Sort order is required",
    })
    .int("Sort order must be a whole number")
    .min(0, "Sort order cannot be negative"),

  status: z.enum(["active", "inactive"], {
    message: "Status is required",
  }),
});
