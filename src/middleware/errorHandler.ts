import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import { INTERNAL_SERVER_ERROR, OK } from "@/utils/consts/http-status-codes";
import config from "@/config/env";
import logger from "@/services/log.service";

const onError: ErrorHandler = (err, c) => {
  const currentStatus =
    "status" in err ? err.status : c.newResponse(null).status;
  const statusCode =
    currentStatus !== OK
      ? (currentStatus as ContentfulStatusCode)
      : INTERNAL_SERVER_ERROR;

  logger.error(`${c.req.method} - ${c.req.path} - ${err.name}:`, err);

  return c.json(
    {
      success: false,
      error: `${err.name}: ${err.message}`,
      stack: config.NODE_ENV === "development" ? err.stack : undefined,
    },
    statusCode
  );
};

export default onError;
