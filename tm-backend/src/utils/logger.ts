import pino from "pino";
import { isProduction, NODE_ENV } from "../constants";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  // Pretty logs in development
  transport: !isProduction
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,

  base: {
    env: NODE_ENV,
  },

  timestamp: pino.stdTimeFunctions.isoTime,
});
