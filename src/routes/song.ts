import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { SongSchema, SongsSchema } from "../schema/song";
import { prismaClient } from "../lib/prisma";

export const songRoutes = new OpenAPIHono();

//Get all songs
songRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: ["Songs"],
    summary: "Get all songs",
    description: "Get all songs",
    responses: {
      200: {
        description: "Get all songs",
        content: {
          "application/json": {
            schema: SongsSchema,
          },
        },
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    try {
      const songs = await prismaClient.song.findMany();

      return c.json(songs);
    } catch (error) {
      return c.json({ error: error }, 400);
    }
  }
);

//Get a song by slug
songRoutes.openapi(
  createRoute({
    method: "get",
    path: "/:slug",
    tags: ["Songs"],
    summary: "Get a song by slug",
    description: "Get a song by slug",
    request: { params: z.object({ slug: z.string() }) },
    responses: {
      200: {
        description: "Get a song by slug",
        content: {
          "application/json": { schema: SongSchema },
        },
      },
      404: {
        description: "Get a song by slug not found",
      },
    },
  }),
  async (c) => {
    try {
      const slug = c.req.param("slug");
      const song = await prismaClient.song.findFirst({
        where: { slug },
      });

      if (!song) {
        return c.notFound();
      }

      return c.json(song);
    } catch (error) {
      return c.json({ error: error }, 400);
    }
  }
);
