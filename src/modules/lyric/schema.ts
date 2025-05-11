import { z } from "@hono/zod-openapi";

export const LyricSchema = z.object({
  id: z.string().ulid(),
  slug: z.string(),
  songId: z.string(),
  text: z.string(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional().nullable(),
});

export const CreateLyricSchema = LyricSchema.extend({
  id: z.string().ulid().optional(),
  songSlug: z.string(),
}).omit({
  songId: true,
  createdAt: true,
  updatedAt: true,
});

export type LyricType = z.infer<typeof LyricSchema>;
export type CreateLyricType = z.infer<typeof CreateLyricSchema>;
