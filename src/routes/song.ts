import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../lib/prisma";
import { createExtraSlug, createSlugify } from "../lib/slug";
import { checkAuthorized } from "../middleware/auth";
import { SongSchema, SongsSchema, UpdateSongSchema } from "../schema/song";

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

// Patch song by id
songRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/:id",
    tags,
    summary: "Update song by id",
    description: "Update song by id",
    middleware: checkAuthorized,
    request: {
      headers: z.object({
        Authorization: z
          .string()
          .regex(/^Bearer .+$/)
          .openapi({
            description: "Bearer token for authentication",
            example: "Bearer ehyajshdasohdlaks.jsakdj...",
          }),
      }),
      params: z.object({ id: z.string().ulid() }),
      body: {
        content: {
          "application/json": {
            schema: UpdateSongSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Update a song by id",
        content: {
          "application/json": { schema: SongSchema },
        },
      },
      404: {
        description: "Get a song by id not found",
      },
    },
  }),
  async (c) => {
    try {
      const id = c.req.param("id");
      const updateSongJSON = await c.req.json();
      const song = await prisma.song.update({
        data: {
          ...updateSongJSON,
          slug: updateSongJSON.title
            ? createSlugify(`${updateSongJSON.title}-${createExtraSlug()}`)
            : undefined,
        },
        where: {
          id: id,
        },
      });

      return c.json({ song }, 200);
    } catch (error) {
      return c.json({ error }, 404);
    }
  }
);
