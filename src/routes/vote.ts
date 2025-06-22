import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../lib/prisma";
import { checkAuthorized } from "../middleware/auth";
import { BaseVoteSchema } from "../schema/shared";

export const voteRoutes = new OpenAPIHono();

const tags = ["Votes"];

voteRoutes.openapi(
  createRoute({
    method: "get",
    path: "/{lyricId}",
    tags,
    security: [{ Bearer: [] }],
    middleware: checkAuthorized,
    summary: "Get vote",
    description: "Get vote by user id and lyric id",
    request: {
      params: z.object({ lyricId: z.string() }),
    },
    responses: {
      200: {
        description: "Get vote",
        content: {
          "application/json": {
            schema: BaseVoteSchema,
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
      const lyricId = c.req.param("lyricId");
      const user = c.get("user");

      const vote = await prisma.vote.findFirst({
        where: {
          AND: [{ userId: user.id }, { lyricId: lyricId }],
        },
      });

      return c.json(vote, 200);
    } catch (error) {
      return c.json({ error }, 400);
    }
  }
);
