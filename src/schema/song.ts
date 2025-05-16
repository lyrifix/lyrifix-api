import { z } from "@hono/zod-openapi";
import { LyricSchema } from "./lyric";
import { ArtistSchema } from "./artist";

export const SongSchema = z.object({
  id: z.string().ulid(),
  slug: z.string(),
  title: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional().nullable(),
  artists: z.array(ArtistSchema),
  lyrics: z.array(LyricSchema),
});

export const CreateSongSchema = SongSchema.extend({
  artistsId: z.array(z.string()),
  lyricsText: z.string(),
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
