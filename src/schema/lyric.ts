import { z } from "@hono/zod-openapi";

export const LyricSchema = z.object({
  id: z.string().ulid(),
  slug: z.string(),
  text: z.string().min(10),
  songId: z.string(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional().nullable(),
});

export const CreateLyricSchema = LyricSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export const DummyLyricSchema = LyricSchema.extend({
  songSlug: z.string(),
}).omit({
  id: true,
  songId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateLyricSchema = LyricSchema.omit({
  id: true,
  songId: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export const LyricsSchema = z.array(LyricSchema);

export type LyricType = z.infer<typeof LyricSchema>;
export type LyricsType = z.infer<typeof LyricsSchema>;
export type CreateLyricType = z.infer<typeof CreateLyricSchema>;
export type DummyLyricType = z.infer<typeof DummyLyricSchema>;
export type UpdateLyricType = z.infer<typeof UpdateLyricSchema>;
