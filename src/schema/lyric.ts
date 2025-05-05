import { z } from "@hono/zod-openapi";

export const LyricSchema = z.object({
  id: z.string().cuid().openapi({ example: "ckl5i0g8q0000h8bvt9q3xk4x" }),
  slug: z.string().openapi({ example: "indonesia-raya-ver-1-xxxxx" }),
  songId: z.string().openapi({ example: "ckl5i0g8q0000h8bvt9q3xjhg" }),
  text: z.string().openapi({
    example:
      "Indonesia tanah airku\nTanah tumpah darahku\nDi sanalah aku berdiri\nJadi pandu ibuku\nIndonesia kebangsaanku\nBangsa dan tanah airku\nMarilah kita berseru\nIndonesia bersatu\n\nHiduplah tanahku\nHiduplah negeriku\nBangsaku rakyatku semuanya\nBangunlah jiwanya\nBangunlah badannya\nUntuk Indonesia Raya\n\nIndonesia Raya\nMerdeka, merdeka\nTanahku, negeriku yang kucinta\nIndonesia Raya\nMerdeka, merdeka\nHiduplah Indonesia Raya\n\nIndonesia Raya\nMerdeka, merdeka\nTanahku, negeriku yang kucinta\nIndonesia Raya\nMerdeka, merdeka\nHiduplah Indonesia Raya",
  }),
  createdAt: z.string().datetime().optional().openapi({ example: "2025-05-05T14:29:37.360Z" }),
  updatedAt: z.string().datetime().optional().nullable().openapi({ example: "2025-05-05T14:29:37.360Z" }),
});

export type LyricType = z.infer<typeof LyricSchema>;
