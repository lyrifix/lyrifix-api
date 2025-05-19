import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../lib/prisma";
import { checkAuthorized } from "../middleware/auth";
import { LibrarySchema } from "../schema/library";

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
        content: { "application/json": { schema: LibrarySchema } },
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
      const [userData, artists, songs, lyrics] = await Promise.all([
        prisma.user.findUnique({ where: { id: user.id } }),

        prisma.artist.findMany({
          where: { userId: user.id },
          orderBy: { updatedAt: "desc" },
        }),

        prisma.song.findMany({
          where: { userId: user.id },
          include: { artists: true },
          orderBy: { updatedAt: "desc" },
        }),

        prisma.lyric.findMany({
          where: { userId: user.id },
          orderBy: { updatedAt: "desc" },
        }),
      ]);

      return c.json({ user: userData, artists, songs, lyrics }, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  }
);
