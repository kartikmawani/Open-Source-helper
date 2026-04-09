import * as express from 'express';
import { Logger } from 'pino';

declare global {
  namespace Express {
    interface Request {
      
      log: Logger; 
    }
  }
}