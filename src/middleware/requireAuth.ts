import auth from "@/config/auth";
import logger from "@/services/log.service";
import { Context, Next } from "hono";

export const requireAuth = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    logger.warn(
      `Unauthorized access attempted at ${new Date().toISOString()}, path: ${c.req.raw.url}`
    );
    return c.json(
      { success: false, error: `Unauthorized. You are not logged in.` },
      401
    );
  }
  c.set("user", session.user);
  c.set("session", session.session);
  c.set("userId", session.user.id);
  c.set(
    "organizationId",
    session.session.activeOrganizationId || session.user.id
  );
  return next();
};
