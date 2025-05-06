import { z } from "@hono/zod-openapi";

export const ArtistSchema = z.object({
  id: z.string().ulid().openapi({ example: "01F8TQG6AYG2K9W0ABW1BHT7P1" }),
  slug: z.string().openapi({ example: "warga-indonesia-xxxxx" }),
  name: z.string().openapi({ example: "Warga Indonesia" }),
  imageUrl: z
    .string()
    .nullable()
    .openapi({ example: "https://ucarecdn.com/91a326f4-283e-421b-be9a-86227c61b7bc/examplelukeoslizlo.jpg" }),
  createdAt: z.string().datetime().optional().openapi({ example: "2025-05-05T14:29:37.360Z" }),
  updatedAt: z.string().datetime().optional().nullable().openapi({ example: "2025-05-05T14:29:37.360Z" }),
});

export const CreateArtistSchema = ArtistSchema.extend({
  id: z.string().ulid().optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export type ArtistType = z.infer<typeof ArtistSchema>;
export type CreateArtistType = z.infer<typeof CreateArtistSchema>;
