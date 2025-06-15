import { z } from "@hono/zod-openapi";
import { BaseArtistSchema, BaseLyricSchema, BaseSongSchema } from "./shared";
import { UserSchema } from "../generated/zod";

export const LyricSchema = BaseLyricSchema.extend({
  user: UserSchema.optional(),
  song: BaseSongSchema.extend({
    artists: z.array(BaseArtistSchema),
  }).optional(),
});

export const LyricsSchema = z.array(LyricSchema);

export const CreateLyricSchema = BaseLyricSchema.pick({
  songId: true,
  text: true,
});

export const SeedLyricSchema = BaseLyricSchema.extend({
  songSlug: z.string(),
}).omit({
  id: true,
  songId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateLyricSchema = LyricSchema.pick({
  text: true,
});

export type LyricType = z.infer<typeof LyricSchema>;
export type LyricsType = z.infer<typeof LyricsSchema>;
export type CreateLyricType = z.infer<typeof CreateLyricSchema>;
export type SeedLyricType = z.infer<typeof SeedLyricSchema>;
export type UpdateLyricType = z.infer<typeof UpdateLyricSchema>;
