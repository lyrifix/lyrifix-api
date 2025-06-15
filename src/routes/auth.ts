import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { hashPassword, verifyPassword } from "../lib/password";
import { prisma } from "../lib/prisma";
import { generateToken } from "../lib/token";
import { checkAuthorized } from "../middleware/auth";
import {
  LoginResponseSchema,
  LoginUserSchema,
  PrivateUserSchema,
  RegisterUserSchema,
} from "../schema/user";

export const authRoutes = new OpenAPIHono();

const tags = ["Auth"];

// POST /register
authRoutes.openapi(
  createRoute({
    method: "post",
    path: "/register",
    tags,
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
          ...body,
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
    tags,
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
    tags,
    summary: "Me",
    security: [{ Bearer: [] }],
    middleware: checkAuthorized,
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
