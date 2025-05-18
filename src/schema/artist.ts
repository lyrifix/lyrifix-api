import { z } from "@hono/zod-openapi";
import { BaseArtistSchema, BaseSongSchema } from "./shared";

export const ArtistSchema = BaseArtistSchema.extend({
  songs: z.array(BaseSongSchema).optional(),
});

export const CreateArtistSchema = BaseArtistSchema.extend({
  id: z.string().ulid().optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export type ArtistType = z.infer<typeof ArtistSchema>;
export type CreateArtistType = z.infer<typeof CreateArtistSchema>;
