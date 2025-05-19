import { z } from "@hono/zod-openapi";
import { BaseArtistSchema, BaseLyricSchema, BaseSongSchema } from "./shared";

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
}).extend({
  artists: z.array(BaseArtistSchema).optional(),
  songs: z.array(BaseSongSchema).optional(),
  lyrics: z.array(BaseLyricSchema).optional(),
});

export const PublicUsersSchema = z.array(PublicUserSchema);

export const RegisterUserSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  fullName: z.string(),
  email: z.string(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 carachter" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/\d/, {
      message: "Password must contain at least one number",
    })
    .regex(/\W/, {
      message: "Password must contain at least one special character",
    })
    .refine((val) => !/\s/.test(val), {
      message: "Password must not contain spaces",
    }),
});

export const LoginUserSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
});

export const SeedUserSchema = RegisterUserSchema;

export type SeedUserType = z.infer<typeof SeedUserSchema>;
