import express from 'express';
   
// Initialize Express App as a Singleton
class ExpressAppSingleton {
   private static instance: express.Application;

   private constructor() { }

   static getInstance(): express.Application {
      if (!ExpressAppSingleton.instance) {
         ExpressAppSingleton.instance = express();
      }

      return ExpressAppSingleton.instance;
   }
}

export default ExpressAppSingleton.getInstance();