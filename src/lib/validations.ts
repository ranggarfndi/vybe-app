import { z } from "zod";

// ============================================================
// Auth Schemas
// ============================================================

export const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password is too long"),
    confirmPassword: z.string(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers, and underscores"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ============================================================
// Profile Schemas
// ============================================================

export const updateProfileSchema = z.object({
  display_name: z
    .string()
    .max(60, "Display name cannot exceed 60 characters")
    .optional(),
  bio: z.string().max(160, "Bio cannot exceed 160 characters").optional(),
  instagram_username: z
    .string()
    .max(30, "Instagram username is too long")
    .regex(
      /^[a-zA-Z0-9_.]*$/,
      "Invalid Instagram username characters"
    )
    .optional(),
  allow_anonymous: z.boolean().optional(),
  profile_theme: z.enum(["dark", "light", "gradient"]).optional(),
  is_public: z.boolean().optional(),
});

// ============================================================
// Drop Schemas
// ============================================================

export const createDropSchema = z.object({
  type: z.enum([
    "SEND_ME_A_SONG",
    "DESCRIBE_ME_WITH_A_SONG",
    "ANONYMOUS_MESSAGE",
    "FIRST_IMPRESSION",
    "SECRET_CONFESSION",
    "MIDNIGHT_THOUGHT",
    "VIBE_CHECK",
  ]),
  question: z
    .string()
    .max(160, "Question cannot exceed 160 characters")
    .optional(),
  allows_anonymous: z.boolean().default(true),
  expires_at: z.string().datetime().optional().nullable(),
});

// ============================================================
// Response Schemas
// ============================================================

export const createResponseSchema = z
  .object({
    dropId: z.string().uuid("Invalid drop ID"),
    message: z
      .string()
      .trim()
      .max(500, "Message cannot exceed 500 characters")
      .optional(),
    spotifyUrl: z.string().url("Invalid URL").optional(),
    reason: z
      .string()
      .trim()
      .max(240, "Reason cannot exceed 240 characters")
      .optional(),
  })
  .refine(
    (data) => data.message || data.spotifyUrl,
    "Please provide a message or a Spotify link"
  );

// ============================================================
// Report Schema
// ============================================================

export const createReportSchema = z.object({
  responseId: z.string().uuid().optional(),
  dropId: z.string().uuid().optional(),
  reason: z.string().min(1, "Please select a reason").max(100),
  details: z.string().max(500).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateDropInput = z.infer<typeof createDropSchema>;
export type CreateResponseInput = z.infer<typeof createResponseSchema>;
export type CreateReportInput = z.infer<typeof createReportSchema>;
