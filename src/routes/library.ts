import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../lib/prisma";
import { checkAuthorized } from "../middleware/auth";
import {
  BaseArtistsSchema,
  BaseLyricsSchema,
  BaseSongsSchema,
} from "../schema/shared";

export const libraryRoutes = new OpenAPIHono();

const tags = ["Library"];

// Get user's library
// Similar with Shopping Cart
libraryRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags,
    summary: "Get user's library",
    description: "Include all submitted artists, songs, lyrics.",
    // request: { query: z.object({ q: z.string().min(1) }) }, // Search for later
    middleware: checkAuthorized,
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.object({
              artists: BaseArtistsSchema,
              songs: BaseSongsSchema,
              lyrics: BaseLyricsSchema,
            }),
          },
        },
        description: "Get user's library data",
      },
      400: { description: "Bad request" },
    },
  }),
  async (c) => {
    const user = c.get("user");
    // const q = c.req.query("q"); // Search for later

    try {
      // TODO: Raw SQL via TypedSQL would be better
      const [artists, songs, lyrics] = await Promise.all([
        prisma.artist.findMany({ where: { userId: user.id } }),
        prisma.song.findMany({ where: { userId: user.id } }),
        prisma.lyric.findMany({ where: { userId: user.id } }),
      ]);

      return c.json({ artists, songs, lyrics }, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  }
);
