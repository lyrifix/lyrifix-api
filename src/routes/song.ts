import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../lib/prisma";
import { createExtraSlug, createSlugify } from "../lib/slug";
import { checkAuthorized } from "../middleware/auth";
import {
  CreateSongSchema,
  SongSchema,
  SongsSchema,
  UpdateSongSchema,
} from "../schema/song";
import { BaseSongSchema } from "../schema/shared";

export const songRoutes = new OpenAPIHono();

const tags = ["Songs"];

// Get all songs
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

// Add new song
songRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags,
    summary: "Add new song",
    description: "Add new song",
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
      body: { content: { "application/json": { schema: CreateSongSchema } } },
    },
    responses: {
      200: {
        description: "Add new song",
        content: {
          "application/json": { schema: SongSchema.omit({ lyrics: true }) },
        },
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    try {
      const body = c.req.valid("json");

      // Check all artists, is exist in database
      for (const artistId of body.artistIds) {
        await prisma.artist.findUnique({
          where: { id: artistId },
          select: { id: true },
        });
      }

      const userId = c.get("user").id;

      const newSong = await prisma.song.create({
        data: {
          slug: `${createSlugify(body.title)}-${createExtraSlug()}`,
          title: body.title,
          imageUrl: body.imageUrl,
          artists: {
            connect: body.artistIds.map((id) => ({ id })),
          },
          userId,
        },
      });

      return c.json({ newSong }, 201);
    } catch (error) {
      return c.json({ error }, 400);
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

// Delete song by id
songRoutes.openapi(
  createRoute({
    method: "delete",
    path: "/:id",
    tags,
    middleware: checkAuthorized,
    summary: "Delete song by id",
    description: "Delete song by id",
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
    },
    responses: {
      200: {
        description: "Song successfully deleted",
        content: {
          "application/json": {
            schema: SongSchema,
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
      const id = c.req.param("id");
      const song = await prisma.song.delete({
        where: {
          id: id,
        },
      });

      return c.json({ song }, 201);
    } catch (error) {
      return c.json({ error }, 400);
    }
  }
);
