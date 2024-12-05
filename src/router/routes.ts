import express from 'express';

import testRouter from '@router/v1/test';

const router = (expressRouter: express.Router) => {
   testRouter(expressRouter);
   return expressRouter;
};

export default router;
