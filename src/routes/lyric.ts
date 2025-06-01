import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../lib/prisma";
import { createExtraSlug } from "../lib/slug";
import { checkAuthorized } from "../middleware/auth";
import {
  CreateLyricSchema,
  LyricSchema,
  LyricsSchema,
  UpdateLyricSchema,
} from "../schema/lyric";
import { BaseLyricSchema } from "../schema/shared";

export const lyricRoutes = new OpenAPIHono();

const tags = ["Lyrics"];

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
      const lyrics = await prisma.lyric.findMany({
        include: { song: { include: { artists: true } } },
      });

      return c.json({ lyrics }, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  }
);

// Get lyric by slug
lyricRoutes.openapi(
  createRoute({
    method: "get",
    path: "/:slug",
    tags,
    summary: "Get a lyric by slug",
    description: "Get a lyric by slug",
    request: {
      params: z.object({ slug: z.string() }),
    },
    responses: {
      200: {
        description: "Get a lyric by slug",
        content: { "application/json": { schema: LyricSchema } },
      },
      400: { description: "Bad request" },
    },
  }),
  async (c) => {
    try {
      const slug = c.req.param("slug");

      const lyric = await prisma.lyric.findUnique({
        where: { slug: slug },
        include: { song: { include: { artists: true } } },
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
            schema: BaseLyricSchema,
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
      const body = c.req.valid("json");
      const user = c.get("user");

      const newLyric = await prisma.lyric.create({
        data: {
          userId: user.id,
          songId: body.songId,
          slug: createExtraSlug(15),
          text: body.text,
        },
      });

      return c.json(newLyric, 201);
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
