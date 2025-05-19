import { z } from "zod";
import { BaseArtistsSchema, BaseLyricsSchema, BaseSongsSchema } from "./shared";
import { UserSchema } from "../../prisma/generated/zod";

export const LibrarySchema = z.object({
  user: UserSchema,
  artists: BaseArtistsSchema,
  songs: BaseSongsSchema,
  lyrics: BaseLyricsSchema,
});
