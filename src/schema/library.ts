import { z } from "zod";
import { BaseArtistsSchema, BaseLyricsSchema } from "./shared";
import { UserSchema } from "../../prisma/generated/zod";
import { SongsSchema } from "./song";

export const LibrarySchema = z.object({
  user: UserSchema,
  artists: BaseArtistsSchema,
  songs: SongsSchema,
  lyrics: BaseLyricsSchema,
});
