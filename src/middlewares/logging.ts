import logger from '@libs/logger';
import { Request, Response, NextFunction } from 'express';

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
   const log = `${new Date().toISOString()} [${req.method}] ${req.originalUrl} ${req.ip} ${req.hostname} ${req.path}`;
   logger.info(log);
   next();
};

export { loggingMiddleware }