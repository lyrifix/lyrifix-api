import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../lib/prisma";
import { PublicUsersSchema } from "../schema/user";

export const usersRoutes = new OpenAPIHono();

const tags = ["Users"];

// Get all users
usersRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags,
    summary: "Get all users",
    responses: {
      200: {
        content: { "application/json": { schema: PublicUsersSchema } },
        description: "Get all users",
      },
    },
  }),
  async (c) => {
    const users = await prisma.user.findMany({
      omit: { email: true },
    });
    return c.json(users);
  }
);

// Get user by id
usersRoutes.openapi(
  createRoute({
    method: "get",
    path: "/:id",
    tags,
    summary: "Get user by id",
    request: { params: z.object({ id: z.string() }) },
    responses: {
      200: {
        content: { "application/json": { schema: PublicUsersSchema } },
        description: "Get user by id",
      },
      404: {
        description: "User not found",
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const user = await prisma.user.findUnique({
      where: { id },
      omit: { email: true },
    });

    if (!user) {
      return c.notFound();
    }

    return c.json(user);
  }
);
