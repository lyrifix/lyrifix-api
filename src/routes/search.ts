import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../lib/prisma";
import { SearchSchema } from "../schema/search";

export const searchRoutes = new OpenAPIHono();

const tags = ["Search"];

// Search songs by keyword
searchRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags,
    summary: "Search songs by query/keyword",
    description: "Each songs include artists and lyrics.",
    request: { query: z.object({ q: z.string().min(1) }) },
    responses: {
      200: {
        content: { "application/json": { schema: SearchSchema } },
        description: "Search result",
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    const q = c.req.query("q");

    try {
      const songs = await prisma.song.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            {
              lyrics: {
                some: {
                  text: { contains: q, mode: "insensitive" },
                },
              },
            },
            {
              artists: {
                some: {
                  name: { contains: q, mode: "insensitive" },
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

      return c.json({ songs, artists: [], lyrics: [] }, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  }
);
