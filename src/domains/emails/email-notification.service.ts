import { Queue } from 'bullmq';

import { QUEUE_NAMES } from '@constants/index';
import { connection } from '@libs/redis-connection';
import { config } from '@configs/index';
import logger from '@libs/logger';

import { User, UserRole } from '@prisma/client';
import { EmailNotificationPayload } from '@domains/emails/types';
import { EmailNotificationType } from '@prisma/client';
import EmailService from '@domains/emails/email.service';

export default class EmailNotificationService {
   private emailService: EmailService;
   private emailQueue: Queue;

   constructor() {
      this.emailQueue = new Queue(QUEUE_NAMES.EMAIL_NOTIFICATION, { connection });
      this.emailService = new EmailService();
   }

   private async queueNotification(payload: EmailNotificationPayload): Promise<void> {
      await this.emailQueue.add(QUEUE_NAMES.EMAIL_NOTIFICATION, payload, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000
        }
      });

      logger.info(`Email queued: ${payload.subject}`);
    }

    async sendWelcomeEmail(user: User): Promise<void> {
      const payload: EmailNotificationPayload = {
        to: user.email,
        from: config().system_email,
        subject: 'Welcome to the OSIRIS Platform',
        message: 'Thank you for signing up for the OSIRIS Platform.'
      };

      await this.queueNotification(payload);
    }

   async notifyBVISubmission(submission_id: string, submitter: User): Promise<void> {
      const payload: EmailNotificationPayload = {
        to: submitter.email,
        from: config().system_email,
         subject: 'BVI Company Application',
         message: `You have received a submission.
         ${config().frontend_url}/submissions/${submission_id} // TODO: change to backend url and full url
         `
      };

      await this.queueNotification(payload);
    }

    async notifyReviewFeedback(
      submission_id: string,
      reviewer: User,
      submitter: User
    ): Promise<void> {
      const payload: EmailNotificationPayload = {
        to: submitter.email,
        from: reviewer.email,
        subject: 'Application Review Feedback',
        message: `Your application has been reviewed and requires feedback, please re-assess your submission via the platform to submit.
        ${config().frontend_url}/submissions/${submission_id}/edit` // TODO: change to backend url and full url
      };
  
      await this.queueNotification(payload);
    }

    async notifySubmissionUpdate(
      submission_id: string,
      company_name: string,
      osiris_user: User
    ): Promise<void> {
      const payload: EmailNotificationPayload = {
        to: osiris_user.email,
        from: config().system_email,
        subject: `Submission Update - ${company_name}`,
        message: `An update has occurred on ${company_name}. Please review this submission.
        ${config().base_url}/submissions/${submission_id}`
      };
  
      await this.queueNotification(payload);
    }
  
    async notifySubmissionApproval(
      submission_id: string,
      submitter: User
    ): Promise<void> {
      const payload: EmailNotificationPayload = {
        to: submitter.email,
        from: config().system_email,
        subject: 'Submission Approved',
        message: 'Your submission has been approved and has progressed.'
      };
  
      await this.queueNotification(payload);
    }
}
