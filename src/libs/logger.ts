import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, json, errors } = winston.format;

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(errors({ stack: true }), timestamp(), json()),
  defaultMeta: { service: 'request', timestamp: `[${new Date().toISOString()}]`},
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exception.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'rejections.log' }),
  ],
  transports: [dailyRotateFileTransport],
});

if (process.env.NODE_ENV !== 'production') {
   logger.add(new winston.transports.Console({
     format: winston.format.simple(),
   } as winston.transports.ConsoleTransportOptions));
}

export default logger;
