import express from "express";
import EmailController from "@domains/emails/email.controller";

// make the root path
const rootPath = '/test';

const testRouter = (router: express.Router) => {
   router.post(`${rootPath}/send-email`, async (req, res) => {
      await EmailController.sendWelcomeEmail(req, res);
   });
   router.get(`${rootPath}/`, (req, res) => {
      res.send('Hello World');
   });
};

export default testRouter;
