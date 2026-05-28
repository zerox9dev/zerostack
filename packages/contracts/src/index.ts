import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.string().datetime({ offset: true }),
});

export type User = z.infer<typeof userSchema>;

export const signInSchema = z.object({
  email: z.string().email(),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const noteSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1).max(200),
  content: z.string(),
  createdAt: z.string().datetime({ offset: true }),
});

export type Note = z.infer<typeof noteSchema>;

export const createNoteSchema = noteSchema.pick({ title: true, content: true }).extend({
  content: z.string().max(10_000).default(""),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const profileSchema = z.object({
  userId: z.string().uuid(),
  displayName: z.string().min(1).max(80).nullable(),
  avatarUrl: z.string().url().nullable(),
  updatedAt: z.string().datetime({ offset: true }),
});

export type Profile = z.infer<typeof profileSchema>;

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .max(80)
    .transform((v) => (v.length === 0 ? null : v))
    .nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const waitlistEntrySchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  source: z.string().nullable(),
  userAgent: z.string().nullable(),
  createdAt: z.string().datetime({ offset: true }),
});

export type WaitlistEntry = z.infer<typeof waitlistEntrySchema>;

export const joinWaitlistSchema = z.object({
  email: z.string().email(),
  source: z.string().max(80).optional(),
});

export type JoinWaitlistInput = z.infer<typeof joinWaitlistSchema>;

export const feedbackSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  message: z.string().min(1).max(5000),
  page: z.string().nullable(),
  createdAt: z.string().datetime({ offset: true }),
});

export type Feedback = z.infer<typeof feedbackSchema>;

export const submitFeedbackSchema = z.object({
  message: z.string().trim().min(1, "Message is required.").max(5000),
  page: z.string().max(200).optional(),
});

export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;
