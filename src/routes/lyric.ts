import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../lib/prisma";
import { createExtraSlug, createSlugify } from "../lib/slug";
import { CreateLyricSchema, LyricSchema, LyricsSchema, UpdateLyricSchema } from "../schema/lyric";
import { checkAuthorized } from "../middleware/auth";

export const lyricRoutes = new OpenAPIHono();

const tags = ["Lyric"];

// Get all lyrics
lyricRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags,
    summary: "Get all lyrics",
    description: "Get all lyrics",
    responses: {
      200: {
        description: "Get all lyrics",
        content: {
          "application/json": {
            schema: LyricsSchema,
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
      const lyrics = await prisma.lyric.findMany();

      return c.json({ lyrics }, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  }
);

// Get lyric by id
lyricRoutes.openapi(
  createRoute({
    method: "get",
    path: "/:id",
    tags,
    summary: "Get lyric by id",
    description: "Get lyric by id",
    request: {
      params: z.object({ id: z.string().ulid() }),
    },
    responses: {
      200: {
        description: "Get lyric by id",
        content: {
          "application/json": {
            schema: LyricSchema,
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
      const lyric = await prisma.lyric.findUnique({
        where: {
          id: id,
        },
      });

      return c.json({ lyric }, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  }
);

// Add new lyric
lyricRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags,
    middleware: checkAuthorized,
    summary: "Add new lyric",
    description: "Add new lyric",
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
      body: {
        content: {
          "application/json": {
            schema: CreateLyricSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Add new lyric",
        content: {
          "application/json": {
            schema: LyricSchema,
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
      const newLyricJSON = c.req.valid("json");
      const song = await prisma.song.findUnique({
        where: {
          id: newLyricJSON.songId,
        },
        select: {
          title: true,
        },
      });

      let lyric;
      if (song?.title) {
        lyric = await prisma.lyric.create({
          data: {
            slug: `${createSlugify(song?.title)}-${createExtraSlug()}`,
            text: newLyricJSON.text,
            song: {
              connect: {
                id: newLyricJSON.songId,
              },
            },
          },
        });
      }

      return c.json({ lyric }, 201);
    } catch (error) {
      return c.json({ error }, 400);
    }
  }
);

// Edit lyric by id
lyricRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/:id",
    tags,
    middleware: checkAuthorized,
    summary: "Edit lyric",
    description: "Edit lyric",
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
            schema: UpdateLyricSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Edit lyric",
        content: {
          "application/json": {
            schema: LyricSchema,
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
      console.log("ID: " + id);

      const updateLyricJSON = c.req.valid("json");

      const lyric = await prisma.lyric.update({
        where: {
          id: id,
        },
        data: {
          text: updateLyricJSON.text,
        },
      });

      return c.json({ lyric }, 201);
    } catch (error) {
      return c.json({ error }, 400);
    }
  }
);

// Delete lyric by id
lyricRoutes.openapi(
  createRoute({
    method: "delete",
    path: "/:id",
    tags,
    middleware: checkAuthorized,
    summary: "Delete lyric",
    description: "Delete lyric by id",
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
        description: "Delete lyric",
        content: {
          "application/json": {
            schema: LyricSchema,
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
      const lyric = await prisma.lyric.delete({
        where: {
          id: id,
        },
      });

      return c.json({ lyric }, 201);
    } catch (error) {
      return c.json({ error }, 400);
    }
  }
);
