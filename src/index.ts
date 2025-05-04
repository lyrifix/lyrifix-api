import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { configDocs, configGeneral } from "./configs/app";

const app = new OpenAPIHono();

app.use(cors());
app.use(logger());

app.basePath("/");

app
  .doc(configDocs.openapi, {
    openapi: "3.1.0",
    info: { ...configGeneral, version: "v1" },
  })
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
