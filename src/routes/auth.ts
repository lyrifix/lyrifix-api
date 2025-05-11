import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../lib/prisma";
import { LoginResponseSchema, LoginUserSchema, PrivateUserSchema, RegisterUserSchema } from "../schema/user";
import { hashPassword, verifyPassword } from "../lib/password";
import { generateToken } from "../lib/token";
import { checkAuthorized } from "../middleware/auth";

export const authRoutes = new OpenAPIHono();

// POST /register
authRoutes.openapi(
  createRoute({
    method: "post",
    path: "/register",
    tags: ["Auth"],
    summary: "Register user",
    description: "Register user",
    request: {
      body: { content: { "application/json": { schema: RegisterUserSchema } } },
    },
    responses: {
      200: {
        content: { "application/json": { schema: RegisterUserSchema } },
        description: "Successfully registered",
      },
      400: {
        description: "Failed to register user",
      },
    },
  }),
  async (c) => {
    try {
      const body = c.req.valid("json");

      const user = await prisma.user.create({
        data: {
          fullName: body.fullName,
          email: body.email,
          password: { create: { hash: await hashPassword(body.password) } },
        },
        omit: { email: true },
      });

      return c.json(user);
    } catch (error) {
      console.error(error);
      return c.json({ message: "Failed to register user", error }, 400);
    }
  }
);

// POST /login
authRoutes.openapi(
  createRoute({
    method: "post",
    path: "/login",
    tags: ["Auth"],
    summary: "Login user",
    description: "Login user",
    request: {
      body: { content: { "application/json": { schema: LoginUserSchema } } },
    },
    responses: {
      200: {
        content: { "application/json": { schema: LoginResponseSchema } },
        description: "Successfully logged in",
      },
      404: {
        description: "Failed to login",
      },
    },
  }),
  async (c) => {
    const body = c.req.valid("json");

    const user = await prisma.user.findUnique({
      where: { email: body.email },
      include: { password: true },
    });
    if (!user) {
      return c.json({ message: "User not found" }, 400);
    }
    if (!user.password?.hash) {
      return c.json({ message: "User does not have a password" }, 400);
    }

    const isValid = await verifyPassword(user.password.hash, body.password);
    if (!isValid) {
      return c.json({ message: "Invalid password" }, 400);
    }

    const token = generateToken(user.id);

    return c.json({
      token,
    });
  }
);

// GET /auth/me
authRoutes.openapi(
  createRoute({
    method: "get",
    path: "/me",
    tags: ["Auth"],
    summary: "Me",
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
    },
    responses: {
      200: {
        content: { "application/json": { schema: PrivateUserSchema } },
        description: "Get user info",
      },
    },
  }),
  async (c) => {
    const user = c.get("user");
    return c.json(user);
  }
);
