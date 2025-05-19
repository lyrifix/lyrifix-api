import { z } from "zod";
import { BaseArtistsSchema, BaseLyricsSchema, BaseSongsSchema } from "./shared";

export const LibrarySchema = z.object({
  artists: BaseArtistsSchema,
  songs: BaseSongsSchema,
  lyrics: BaseLyricsSchema,
});
