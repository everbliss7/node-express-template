import express from 'express';
import os from 'os';
import cluster from 'cluster';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import app from '@libs/express-app';
import { config } from '@configs/index';
import logger from '@libs/logger';
import prisma from '@libs/prisma';
import { connection } from '@libs/redis-connection';
import { MonitoringService } from '@domains/monitoring';
import { parseRedisInfo } from '@helpers/redis';
import { loggingMiddleware } from '@middlewares/logging';
import EventEmitterSingleton from '@libs/event-emitter';
import { initializeSocketIO } from '@libs/socketio';
import { handleNotFound } from '@middlewares/all';
import router from '@router/routes';
import { emailWorker } from '@domains/emails/email.worker';

import dotenv from 'dotenv';
dotenv.config();

// Logging Middleware
app.use(loggingMiddleware);

// Event Emitter
const eventEmitter = EventEmitterSingleton;
app.set('eventEmitter', eventEmitter);

app.disable('x-powered-by');
app.use(cors({ 
   origin: '*',
   credentials: true
}));

// Add middleware for parsing request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Start Server
const server = http.createServer(app);
const totalCPUs = os.cpus().length;
logger.info(`Server is running on ${process.env.NODE_ENV} mode`);
logger.info(`Total CPUs: ${totalCPUs}`);
export const io = new Server(server, {
   cors: {
      origin: '*',
      credentials: true
   },
});

// Socket IO
initializeSocketIO(io);

const PORT: string | number = config().port;
server.listen(PORT, () => { 
   logger.info(`Server running on port ${PORT}`);
   logger.info(`Server URL: http://localhost:${PORT}`);
   console.log({secret: config().api.secret});
});

// Expose Routes
app.use('/api/v1', router(express.Router()));

// Health check endpoint
app.get('/api/v1/health', async (req, res) => {
   try {
     // Check database connection
     await prisma.$queryRaw`SELECT 1`;

     // Get prisma pooling and connection info
     const connectionInfo = await prisma.$queryRaw`SHOW client_encoding`;
     const prismaInfo = await prisma.$queryRaw`SELECT pg_catalog.version()`;
     
     // Get queue metrics
     const monitoringService = MonitoringService.getInstance();
     const queueMetrics = await monitoringService.getQueueMetrics();
     const redisMetrics = await connection.info();
 
     res.status(200).json({
       status: 'healthy',
       timestamp: new Date().toISOString(),
       database: 'connected',
       queues: queueMetrics,
       redis: parseRedisInfo(redisMetrics),
       prisma: prismaInfo,
       connection: connectionInfo
     });
   } catch (error) {
     logger.error('Health check failed:', error);
     res.status(500).json({
       status: 'unhealthy',
       error: 'System health check failed'
     });
   }
 });

process.on('unhandledRejection', (err) => {
  logger.error(err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
   logger.info('SIGTERM received. Starting graceful shutdown...');
   
   await prisma.$disconnect();
   logger.info('Disconnected from Prisma');
   connection.quit();
   logger.info('Disconnected from Redis');
   io.close();
   logger.info('Closed Socket.IO connection');
   server.close();
   logger.info('Closed HTTP server');
   await emailWorker.close();
   logger.info('Closed email worker');

   process.exit(0);
 });