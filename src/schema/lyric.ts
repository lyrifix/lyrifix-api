import { z } from "@hono/zod-openapi";
import { BaseArtistSchema, BaseLyricSchema, BaseSongSchema } from "./shared";

export const LyricSchema = BaseLyricSchema.extend({
  song: BaseSongSchema.extend({
    artists: z.array(BaseArtistSchema),
  }).optional(),
});

export const LyricsSchema = z.array(LyricSchema);

export const CreateLyricSchema = LyricSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export const SeedLyricSchema = BaseLyricSchema.extend({
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

export type LyricType = z.infer<typeof LyricSchema>;
export type LyricsType = z.infer<typeof LyricsSchema>;
export type CreateLyricType = z.infer<typeof CreateLyricSchema>;
export type SeedLyricType = z.infer<typeof SeedLyricSchema>;
export type UpdateLyricType = z.infer<typeof UpdateLyricSchema>;
