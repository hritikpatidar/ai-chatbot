import z from "zod";

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
