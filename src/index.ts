import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { configDocs, configGeneral } from "./configs/app";
import { artistRoutes } from "./routes/artist";
import { authRoutes } from "./routes/auth";
import { libraryRoutes } from "./routes/library";
import { lyricRoutes } from "./routes/lyric";
import { searchRoutes } from "./routes/search";
import { songRoutes } from "./routes/song";
import { usersRoutes } from "./routes/user";

const app = new OpenAPIHono();

app.use(cors());
app.use(logger());

app.basePath("/");
app.route("/auth", authRoutes);
app.route("/users", usersRoutes);
app.route("/artists", artistRoutes);
app.route("/songs", songRoutes);
app.route("/lyrics", lyricRoutes);
app.route("/search", searchRoutes);
app.route("/library", libraryRoutes);

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
