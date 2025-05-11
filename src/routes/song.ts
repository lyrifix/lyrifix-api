import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../lib/prisma";
import { SongSchema, SongsSchema } from "../modules/song/schema";

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

//Get songs by keyword
songRoutes.openapi(
  createRoute({
    method: "get",
    path: "/search",
    tags: ["Songs"],
    summary: "Get songs by keyword",
    description: "Get songs by keyword",
    request: { query: z.object({ keyword: z.string().min(1) }) },
    responses: {
      200: {
        content: { "application/json": { schema: SongsSchema } },
        description: "Search result",
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    const keyword = c.req.query("keyword");

    try {
      const songs = await prisma.song.findMany({
        where: {
          OR: [
            { title: { contains: keyword, mode: "insensitive" } },
            {
              lyrics: {
                some: {
                  text: { contains: keyword, mode: "insensitive" },
                },
              },
            },
            {
              artists: {
                some: {
                  name: { contains: keyword, mode: "insensitive" },
                },
              },
            },
          ],
        },
        include: {
          artists: true,
          lyrics: true,
        },
      });

      return c.json({ songs }, 200);
    } catch (error) {
      return c.json({ error }, 400);
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
