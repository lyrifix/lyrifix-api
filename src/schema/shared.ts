import { z } from "zod";
import { ArtistSchema, SongSchema, LyricSchema } from "../generated/zod";

export const BaseArtistSchema = ArtistSchema;
export const BaseSongSchema = SongSchema;
export const BaseLyricSchema = LyricSchema;

export const BaseArtistsSchema = z.array(BaseArtistSchema);
export const BaseSongsSchema = z.array(BaseSongSchema);
export const BaseLyricsSchema = z.array(BaseLyricSchema);
