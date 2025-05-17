import { z } from "@hono/zod-openapi";
import { LyricSchema } from "./lyric";
import { ArtistSchema } from "./artist";
import { BaseSongSchema } from "./shared";

export const SongSchema = BaseSongSchema.extend({
  artists: z.array(ArtistSchema).optional(),
  lyrics: z.array(LyricSchema).optional(),
});

export const DummySongSchema = BaseSongSchema.extend({
  artistSlugs: z.array(z.string()),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateSongSchema = SongSchema.extend({
  artistsId: z.array(z.string()),
}).omit({
  id: true,
  slug: true,
  lyrics: true,
  artists: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateSongSchema = SongSchema.omit({
  id: true,
  slug: true,
  artists: true,
  lyrics: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const SongsSchema = z.array(SongSchema);
export type SongType = z.infer<typeof SongSchema>;
export type CreateSongType = z.infer<typeof CreateSongSchema>;
export type UpdateSongType = z.infer<typeof UpdateSongSchema>;
export type DummySongType = z.infer<typeof DummySongSchema>;
