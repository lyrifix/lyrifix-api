import { z } from "@hono/zod-openapi";
import { LyricSchema } from "./lyric";
import { ArtistSchema } from "./artist";
import { BaseSongSchema } from "./shared";

export const SearchSchema = z.object({
  songs: z.array(BaseSongSchema),
  artists: z.array(ArtistSchema),
  lyrics: z.array(LyricSchema),
});
