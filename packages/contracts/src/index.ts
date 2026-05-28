import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
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
  createdAt: z.string().datetime(),
});

export type Note = z.infer<typeof noteSchema>;

export const createNoteSchema = noteSchema.pick({ title: true, content: true }).extend({
  content: z.string().max(10_000).default(""),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
