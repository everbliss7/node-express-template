import { Worker } from 'bullmq';

import logger from '@libs/logger';
import { connection } from '@libs/redis-connection';
import { QUEUE_NAMES } from '@constants/index';

import { EmailNotificationPayload } from '@domains/emails/types';
import EmailService from '@domains/emails/email.service';

const emailService = new EmailService();

const emailWorker = new Worker(QUEUE_NAMES.EMAIL_NOTIFICATION, async (job) => {
   try {
     const payload: EmailNotificationPayload = job.data;
     await emailService.sendEmail(payload);
     logger.info(`Email sent successfully: ${payload.subject}`);
   } catch (error) {
     logger.error('Failed to send email:', error);
     throw error; // Re-throw to mark the job as failed
   }
},
{ connection }
);

// Add event listeners for better monitoring
emailWorker.on('completed', job => {
  logger.info(`Job ${job.id} completed successfully`);
});

emailWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed:`, err);
});

export { emailWorker };
