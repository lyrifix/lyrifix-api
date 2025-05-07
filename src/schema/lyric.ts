import { z } from "@hono/zod-openapi";

export const LyricSchema = z.object({
  id: z.string().ulid().openapi({ example: "01F8TQG6AYG2K9W0ABW1BHT6Z9" }),
  slug: z.string().openapi({ example: "indonesia-raya-ver-1-xxxxx" }),
  songId: z.string().openapi({ example: "01F8TQG6AYG2K9W0ABW1BHT0A2" }),
  text: z.string().openapi({
    example:
      "Indonesia tanah airku\nTanah tumpah darahku\nDi sanalah aku berdiri\nJadi pandu ibuku\nIndonesia kebangsaanku\nBangsa dan tanah airku\nMarilah kita berseru\nIndonesia bersatu\n\nHiduplah tanahku\nHiduplah negeriku\nBangsaku rakyatku semuanya\nBangunlah jiwanya\nBangunlah badannya\nUntuk Indonesia Raya\n\nIndonesia Raya\nMerdeka, merdeka\nTanahku, negeriku yang kucinta\nIndonesia Raya\nMerdeka, merdeka\nHiduplah Indonesia Raya\n\nIndonesia Raya\nMerdeka, merdeka\nTanahku, negeriku yang kucinta\nIndonesia Raya\nMerdeka, merdeka\nHiduplah Indonesia Raya",
  }),
  createdAt: z.string().datetime().optional().openapi({ example: "2025-05-05T14:29:37.360Z" }),
  updatedAt: z.string().datetime().optional().nullable().openapi({ example: "2025-05-05T14:29:37.360Z" }),
});

export const CreateLyricSchema = LyricSchema.extend({
  id: z.string().ulid().optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export type LyricType = z.infer<typeof LyricSchema>;
export type CreateLyricType = z.infer<typeof CreateLyricSchema>;
