import { z } from "@hono/zod-openapi";

export const SongSchema = z.object({
  id: z.string().ulid().openapi({ example: "01F8TQG6AYG2K9W0ABW1BHT1X6" }),
  slug: z.string().openapi({ example: "indonesia-raya-xxxxx" }),
  title: z.string().openapi({ example: "Indonesia Raya" }),
  imageUrl: z
    .string()
    .nullable()
    .openapi({ example: "https://ucarecdn.com/91a326f4-283e-421b-be9a-86227c61b7bc/examplelukeoslizlo.jpg" }),
  createdAt: z.string().datetime().optional().openapi({ example: "2025-05-05T14:29:37.360Z" }),
  updatedAt: z.string().datetime().optional().nullable().openapi({ example: "2025-05-05T14:29:37.360Z" }),
});

export const CreateSongSchema = SongSchema.extend({
  id: z.string().ulid().optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export const SongsSchema = z.array(SongSchema);
export type SongType = z.infer<typeof SongSchema>;
export type CreateSongType = z.infer<typeof CreateSongSchema>;
