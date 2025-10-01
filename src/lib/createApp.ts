import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";

import { defaultHook } from "@/utils/hono-zod-openapi/defaultHook";
import type { AppBindings } from "@/utils/hono-zod-openapi/types";
import requestLogger from "@/middleware/requestLogger";
import onError from "@/middleware/errorHandler";
import env from "@/config/env";
import { requireAuth } from "@/middleware/requireAuth";
import auth from "@/config/auth";
import configOpenApi from "./configureOpenAPI";
import routes from "@/utils/hono-zod-openapi/routes";

export function createRouter() {
  const router = new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
  return router;
}

export function createApp() {
  const baseApp = createRouter();

  // CORS Middleware
  baseApp.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );

  // Middleware to log Requests
  baseApp.use(requestLogger);

  // Set base path for the API
  const app = baseApp.basePath("/api");

  // Health Check Route
  app.get("/health", (c) => {
    return c.json({ success: true, status: "OK" });
  });

  // Authentication Routes
  app.on(["POST", "GET"], "/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });

  // Middleware to require Auth
  app.use(requireAuth);

  // Application Routes
  routes.forEach((route) => {
    app.route("/", route);
  });

  // Configure OpenAPI Routes
  configOpenApi(app);

  // Not Found Handler
  app.notFound((c) => {
    return c.json({ success: false, error: "Not Found" }, 404);
  });

  // Global Error Handler
  app.onError(onError);

  return app;
}

export default createApp;
