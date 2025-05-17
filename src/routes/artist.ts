import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { ArtistSchema } from "../schema/artist";
import { prisma } from "../lib/prisma";

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
        content: { "application/json": { schema: ArtistSchema } },
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

// Get an artist by slug
artistRoutes.openapi(
  createRoute({
    method: "get",
    path: "/:slug",
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
