import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

import env from "../config/env";

/**
 * Winston logger configuration for Pennylogs backend
 * Provides structured logging with different levels and transports
 */

// Define log levels and colors
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(logColors);

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create transports array
const transports: winston.transport[] = [];

// Console transport for development
if (env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// File transports for all environments
const logsDir = path.join(process.cwd(), "logs");

// Daily rotate file for combined logs
transports.push(
  new DailyRotateFile({
    filename: path.join(logsDir, "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: fileFormat,
  })
);

// Daily rotate file for error logs only
transports.push(
  new DailyRotateFile({
    filename: path.join(logsDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
    level: "error",
    format: fileFormat,
  })
);

// Create the logger instance
const logger = winston.createLogger({
  level: env.LOG_LEVEL || (env.NODE_ENV === "production" ? "info" : "debug"),
  levels: logLevels,
  format: fileFormat,
  transports,
});

logger.info("Logger initialized");
logger.debug(`Log level set to ${logger.level}`);
// logger.debug(`Environment Variables: ${JSON.stringify(env)}`);

// Helper functions for structured logging
export const logUtils = {
  /**
   * Log authentication events
   */
  auth: (
    action: string,
    userId?: string,
    details?: Record<string, unknown>
  ) => {
    logger.info("Authentication event", {
      category: "auth",
      action,
      userId,
      ...details,
    });
  },

  /**
   * Log API requests
   */
  request: (
    method: string,
    url: string,
    userId?: string,
    duration?: number
  ) => {
    logger.http("API request", {
      category: "request",
      method,
      url,
      userId,
      duration,
    });
  },

  /**
   * Log database operations
   */
  database: (
    operation: string,
    table: string,
    userId?: string,
    details?: Record<string, unknown>
  ) => {
    logger.debug("Database operation", {
      category: "database",
      operation,
      table,
      userId,
      ...details,
    });
  },

  /**
   * Log business logic events
   */
  business: (
    event: string,
    userId?: string,
    details?: Record<string, unknown>
  ) => {
    logger.info("Business event", {
      category: "business",
      event,
      userId,
      ...details,
    });
  },

  /**
   * Log security events
   */
  security: (event: string, details?: Record<string, unknown>) => {
    logger.warn("Security event", {
      category: "security",
      event,
      ...details,
    });
  },

  /**
   * Log performance metrics
   */
  performance: (
    metric: string,
    value: number,
    details?: Record<string, unknown>
  ) => {
    logger.info("Performance metric", {
      category: "performance",
      metric,
      value,
      ...details,
    });
  },

  /**
   * Add lines to logs for better readability
   */
  separator: () => {
    logger.info(
      "-----------------------------------------------------------------"
    );
  },
};

export default logger;
