import { z } from "@hono/zod-openapi";

export const PrivateUserSchema = z.object({
  id: z.string().ulid(),
  fullName: z.string(),
  email: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PrivateUser = z.infer<typeof PrivateUserSchema>;

export const PublicUserSchema = PrivateUserSchema.omit({
  email: true,
});

export const PublicUsersSchema = z.array(PublicUserSchema);

export const RegisterUserSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  password: z.string(),
});

export const LoginUserSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
});
