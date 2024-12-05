import { Request, Response, NextFunction } from 'express';
import logger from '@libs/logger';

function handleNotFound(req: Request, res: Response) {
   logger.error(`Not found: ${req.url}`);
   // respond with json
   if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
   }
   
   // respond with html page
   if (req.accepts('html')) {
      res.render('404', { url: req.url });
      return;
   }

   // default to plain-text. send()
   res.type('txt').send('Not found');
};

export { handleNotFound };