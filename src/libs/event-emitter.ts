import { EventEmitter } from 'events';

import logger from '@libs/logger';

class EventEmmiterSingleton {
   private static instance: EventEmitter;

   private constructor() { }

   static getInstance(): EventEmitter {
      if (!EventEmmiterSingleton.instance) {
         EventEmmiterSingleton.instance = new EventEmitter();
      }

      return EventEmmiterSingleton.instance;
   }
}
const eventEmitter = EventEmmiterSingleton.getInstance();

// TODO: Add event types
eventEmitter.on('test-event', (data) => {
   logger.info(data);
});

eventEmitter.on('newYorkTime', (data) => {
   logger.info(data);
});
   
export default eventEmitter;