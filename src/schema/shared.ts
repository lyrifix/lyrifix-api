import { z } from "zod";

export const BaseArtistSchema = z.object({
  id: z.string().ulid(),
  slug: z.string(),
  name: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional().nullable(),
});

export const BaseSongSchema = z.object({
  id: z.string().ulid(),
  slug: z.string(),
  title: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional().nullable(),
});

export const BaseLyricSchema = z.object({
  id: z.string().ulid(),
  slug: z.string(),
  text: z.string(),
  songId: z.string(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional().nullable(),
});

export const BaseArtistsSchema = z.array(BaseArtistSchema);
export const BaseSongsSchema = z.array(BaseSongSchema);
export const BaseLyricsSchema = z.array(BaseLyricSchema);
