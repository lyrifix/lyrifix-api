import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../lib/prisma";
import { SongSchema, SongsSchema } from "../schema/song";

export const songRoutes = new OpenAPIHono();

const tags = ["Songs"];

//Get all songs
songRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags,
    summary: "Get all songs",
    description: "Each songs include artists and lyrics.",
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
      const songs = await prisma.song.findMany({
        include: {
          artists: true,
          lyrics: true,
        },
      });

      return c.json(songs);
    } catch (error) {
      return c.json({ error: error }, 400);
    }
  }
);

// Get a song by slug
songRoutes.openapi(
  createRoute({
    method: "get",
    path: "/:slug",
    tags,
    summary: "Get a song by slug",
    description: "Each song include artists and lyrics.",
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
      const song = await prisma.song.findFirst({
        where: { slug },
        include: {
          artists: true,
          lyrics: true,
        },
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
