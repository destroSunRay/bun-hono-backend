import env from "@/config/env";
import app from "./app";
import logger, { logUtils } from "@/services/log.service";

logUtils.separator();
logger.info(`Starting server in ${env.NODE_ENV} mode...`);

export default {
  port: env.PORT,
  fetch: app.fetch,
};

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT signal received: closing HTTP server");
  process.exit(0);
});
