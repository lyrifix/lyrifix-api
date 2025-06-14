import { z } from "@hono/zod-openapi";
import { LyricSchema } from "./lyric";
import { ArtistSchema } from "./artist";
import { BaseSongSchema } from "./shared";

export const SongSchema = BaseSongSchema.extend({
  artists: z.array(ArtistSchema).optional(),
  lyrics: z.array(LyricSchema).optional(),
});

export const SongsSchema = z.array(SongSchema);

export const SeedSongSchema = BaseSongSchema.extend({
  artistSlugs: z.array(z.string()),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateSongSchema = SongSchema.extend({
  artistIds: z.array(z.string().min(1)),
}).omit({
  id: true,
  slug: true,
  lyrics: true,
  artists: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateSongSchema = SongSchema.pick({
  title: true,
  imageUrl: true,
}).extend({
  artistIds: z.array(z.string().min(1)),
});

export type SongType = z.infer<typeof SongSchema>;
export type CreateSongType = z.infer<typeof CreateSongSchema>;
export type UpdateSongType = z.infer<typeof UpdateSongSchema>;
export type SeedSongType = z.infer<typeof SeedSongSchema>;
