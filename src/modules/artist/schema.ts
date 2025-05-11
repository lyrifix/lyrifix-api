import { z } from "@hono/zod-openapi";

export const ArtistSchema = z.object({
  id: z.string().ulid(),
  slug: z.string(),
  name: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional().nullable(),
});

export const CreateArtistSchema = ArtistSchema.extend({
  id: z.string().ulid().optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export type ArtistType = z.infer<typeof ArtistSchema>;
export type CreateArtistType = z.infer<typeof CreateArtistSchema>;
