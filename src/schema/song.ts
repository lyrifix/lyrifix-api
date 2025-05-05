import { z } from "@hono/zod-openapi";

export const SongSchema = z.object({
  id: z.string().cuid().openapi({ example: "ckl5i0g8q0000h8bvt9q3xk4x" }),
  slug: z.string().openapi({ example: "indonesia-raya-xxxxx" }),
  title: z.string().openapi({ example: "Indonesia Raya" }),
  imageUrl: z
    .string()
    .nullable()
    .openapi({ example: "https://ucarecdn.com/91a326f4-283e-421b-be9a-86227c61b7bc/examplelukeoslizlo.jpg" }),
  createdAt: z.string().datetime().optional().openapi({ example: "2025-05-05T14:29:37.360Z" }),
  updatedAt: z.string().datetime().optional().nullable().openapi({ example: "2025-05-05T14:29:37.360Z" }),
});

export type SongType = z.infer<typeof SongSchema>;
