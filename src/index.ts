import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { rateLimiter } from "hono-rate-limiter";

import { configDocs, configGeneral } from "./configs/app";
import { artistRoutes } from "./routes/artist";
import { authRoutes } from "./routes/auth";
import { libraryRoutes } from "./routes/library";
import { lyricRoutes } from "./routes/lyric";
import { searchRoutes } from "./routes/search";
import { songRoutes } from "./routes/song";
import { usersRoutes } from "./routes/user";
import { voteRoutes } from "./routes/vote";

const app = new OpenAPIHono();

app.use(cors());
app.use(logger());

app.basePath("/");
app.route("/auth", authRoutes);
app.route("/users", usersRoutes);
app.route("/artists", artistRoutes);
app.route("/songs", songRoutes);
app.route("/lyrics", lyricRoutes);
app.route("/votes", voteRoutes);
app.route("/search", searchRoutes);
app.route("/library", libraryRoutes);

app.use(
  "*",
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-6",
    keyGenerator: (c) => {
      // console.log("🔁 keyGenerator dipanggil");
      const ip =
        c.req.header("x-forwarded-for") ??
        c.req.raw.headers.get("x-real-ip") ??
        c.req.raw.headers.get("host") ??
        "global";

      // console.log("🔥 Rate limiter middleware aktif!", ip);

      return ip;
    },
  })
);

app
  .doc(configDocs.openapi, {
    openapi: "3.1.0",
    info: { ...configGeneral, version: "v1" },
  })
  .openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
    type: "http",
    scheme: "bearer",
    in: "header",
    description: "Bearer token for authentication",
  });

app
  .get(
    "/",
    Scalar({
      pageTitle: "Lyrifix API",
      url: "/openapi.json",
      theme: "purple",
    })
  )
  .onError((err, c) => {
    return c.json({ code: 400, status: "error", message: err.message }, 400);
  });

export default app;
