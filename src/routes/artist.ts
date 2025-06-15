import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../lib/prisma";
import { createSlugify } from "../lib/slug";
import { checkAuthorized } from "../middleware/auth";
import {
  ArtistSchema,
  ArtistsSchema,
  CreateArtistSchema,
  UpdateArtistSchema,
} from "../schema/artist";

export const artistRoutes = new OpenAPIHono();

const tags = ["Artists"];

// Get all artists
artistRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags,
    summary: "Get all artists",
    description: "Each artists include songs",
    responses: {
      200: {
        description: "Get all artists",
        content: { "application/json": { schema: ArtistsSchema } },
      },
      400: {
        description: "Bad request",
      },
    },
  }),

  async (c) => {
    try {
      const artists = await prisma.artist.findMany({
        include: {
          songs: true,
        },
      });

      return c.json(artists);
    } catch (error) {
      return c.json({ error: error }, 400);
    }
  }
);

// Add new artist
artistRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags,
    summary: "Add new artist",
    description: "Add new artist",
    security: [{ Bearer: [] }],
    middleware: checkAuthorized,
    request: {
      body: { content: { "application/json": { schema: CreateArtistSchema } } },
    },
    responses: {
      200: {
        description: "Add new artist",
        content: { "application/json": { schema: ArtistSchema } },
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    try {
      const body = c.req.valid("json");

      for (const artistName of body.name) {
        await prisma.artist.findUnique({
          where: {
            name: artistName,
          },
          select: {
            name: true,
          },
        });
      }
      const userId = c.get("user").id;

      const newArtist = await prisma.artist.create({
        data: {
          slug: `${createSlugify(body.name)}`,
          name: body.name,
          imageUrl: body.imageUrl,
          userId,
        },
        select: {
          slug: true,
          name: true,
          imageUrl: true,
          userId: true,
        },
      });

      return c.json(newArtist);
    } catch (error) {
      return c.json({ error: error }, 400);
    }
  }
);

// Get an artist by slug
artistRoutes.openapi(
  createRoute({
    method: "get",
    path: "/{slug}",
    tags,
    summary: "Get an artist by slug",
    description: "Artist include songs",
    request: { params: z.object({ slug: z.string() }) },
    responses: {
      200: {
        description: "Get an artist by slug",
        content: {
          "application/json": { schema: ArtistSchema },
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
      const artist = await prisma.artist.findUnique({
        where: { slug },
        include: {
          songs: true,
        },
      });

      if (!artist) {
        return c.notFound();
      }

      return c.json(artist);
    } catch (error) {
      return c.json({ error: error }, 400);
    }
  }
);

// Edit artist by id
artistRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/{id}",
    tags,
    security: [{ Bearer: [] }],
    middleware: checkAuthorized,
    summary: "Edit artist",
    description: "Edit artist",
    request: {
      params: z.object({ id: z.string().ulid() }),
      body: {
        content: {
          "application/json": {
            schema: UpdateArtistSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Edit lyric",
        content: {
          "application/json": {
            schema: ArtistSchema,
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

      const body = c.req.valid("json");

      const artist = await prisma.artist.update({
        where: {
          id: id,
        },
        data: {
          name: body.name,
          slug: `${createSlugify(body.name)}`,
          imageUrl: body.imageUrl,
        },
      });

      return c.json(artist, 201);
    } catch (error) {
      return c.json({ error }, 400);
    }
  }
);

// Delete song by id
artistRoutes.openapi(
  createRoute({
    method: "delete",
    path: "/{id}",
    tags,
    security: [{ Bearer: [] }],
    middleware: checkAuthorized,
    summary: "Delete artist",
    description: "Delete artist by id",
    request: {
      params: z.object({ id: z.string().ulid() }),
    },
    responses: {
      200: {
        description: "Delete lyric",
        content: {
          "application/json": {
            schema: ArtistSchema,
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
      const artist = await prisma.artist.delete({
        where: {
          id: id,
        },
        include: {
          songs: true,
        },
      });

      return c.json(artist, 201);
    } catch (error) {
      return c.json({ error }, 400);
    }
  }
);
