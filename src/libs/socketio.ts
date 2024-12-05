import { Socket, Server } from 'socket.io';

import logger from '@libs/logger';

export const initializeSocketIO = (io: Server) => {
   logger.info('Initializing Socket.IO');

   io.on('connection', (socket: Socket) => {
      logger.info(`Socket.IO connection established: ${socket.id}`);

      // TODO: Add socket event listeners
   });

   io.on('disconnect', (socket: Socket) => {
      logger.info(`Socket.IO connection disconnected: ${socket.id}`);
   });
}
