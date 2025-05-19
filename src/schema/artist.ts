import { z } from "@hono/zod-openapi";
import { BaseArtistSchema, BaseSongSchema } from "./shared";

export const ArtistSchema = BaseArtistSchema.extend({
  songs: z.array(BaseSongSchema).optional(),
});

export const CreateArtistSchema = BaseArtistSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export const SeedArtistSchema = BaseArtistSchema.extend({
  id: z.string().ulid().optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export const UpdateArtistSchema = BaseArtistSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export type ArtistType = z.infer<typeof ArtistSchema>;
export type SeedArtistType = z.infer<typeof SeedArtistSchema>;
export type CreateArtistType = z.infer<typeof CreateArtistSchema>;
export type UpdateArtistType = z.infer<typeof UpdateArtistSchema>;
