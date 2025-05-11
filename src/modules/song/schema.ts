import { z } from "@hono/zod-openapi";
import { LyricSchema } from "../lyric/schema";
import { ArtistSchema } from "../artist/schema";

export const SongSchema = z.object({
  id: z.string().ulid(),
  slug: z.string(),
  title: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.string().datetime().optional().nullable(),
  updatedAt: z.string().datetime().optional().nullable(),
  artists: z.array(ArtistSchema),
  lyrics: z.array(LyricSchema),
});

export const CreateSongSchema = SongSchema.extend({
  id: z.string().ulid().optional(),
  artistSlugs: z.array(z.string()),
}).omit({
  createdAt: true,
  updatedAt: true,
  artists: true,
  lyrics: true,
});

export const SongsSchema = z.array(SongSchema);
export type SongType = z.infer<typeof SongSchema>;
export type CreateSongType = z.infer<typeof CreateSongSchema>;
