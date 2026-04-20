 
import {pinoHttp} from 'pino-http'
import { randomUUID } from "crypto";
import { logger } from "../utils/logger.js";
import type { IncomingMessage, ServerResponse } from "http";

export const loggerMiddleware = pinoHttp({
  logger, // reuse base logger

  genReqId: (req: IncomingMessage, res: ServerResponse) => {
    const existingID = (req as any).id ?? req.headers["x-request-id"];

  if (existingID) return existingID;

  const id = randomUUID();
  res.setHeader("X-Request-Id", id);
    return id;
  },

  customLogLevel: (req: IncomingMessage,res: ServerResponse,err?: Error) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  }
});