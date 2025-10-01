import type { Hook } from "@hono/zod-openapi";
import { OK, UNPROCESSABLE_ENTITY } from "../consts/http-status-codes";

export const defaultHook: Hook<any, any, any, any> = async (result, c) => {
  if (!result.success) {
    return c.json(
      {
        message: "Validation Error",
        errors: {
          name: result.error.name,
          issues: result.error.issues,
        },
      },
      UNPROCESSABLE_ENTITY
    );
  }
};

export default defaultHook;
