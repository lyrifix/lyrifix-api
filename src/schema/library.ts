import { z } from "zod";
import { BaseArtistsSchema, BaseLyricsSchema, BaseSongSchema } from "./shared";
import { UserSchema } from "../generated/zod";
import { SongsSchema } from "./song";
import { ArtistSchema } from "./artist";

export const LibrarySchema = z.object({
  user: UserSchema,
  artists: BaseArtistsSchema,
  songs: SongsSchema,
  lyrics: BaseLyricsSchema.element
    .extend({
      song: BaseSongSchema.extend({
        artists: z.array(ArtistSchema).optional(),
      }),
    })
    .array(),
});
