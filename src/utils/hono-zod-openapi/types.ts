import { Session, User } from "@/features/auth/auth.types";
import { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { Schema } from "hono";

export interface AppBindings {
  Variables: {
    user: User | null;
    session: Session | null;
    userId: string | null;
    organizationId: string | null;
  };
}

// Helper type for OpenAPIHono with AppBindings
export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppBindings, S>;

// Helper type for route handlers with AppBindings
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;
