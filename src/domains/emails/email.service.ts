import nodemailer, { Transporter } from 'nodemailer';
import { 
   EmailNotificationType, 
   NotificationPriority, 
   NotificationStatus, 
   UserRole, 
   EmailNotification 
} from '@prisma/client';

import { config } from '@configs/index';
import logger from '@libs/logger';
import { EmailNotificationPayload } from '@domains/emails/types'; 

const configs = config();
export default class EmailService {
   
   private transporter: Transporter;

   constructor() {
      console.log({auth: configs.email.auth});
      if (!configs.email.auth.user || !configs.email.auth.pass) {
         logger.error('Email credentials are missing in configuration');
         throw new Error('Email credentials are not properly configured');
      }


      this.transporter = nodemailer.createTransport({
         host: configs.email.host,
         port: configs.email.port,
         secure: configs.email.secure,
         auth: {
            user: configs.email.auth.user,
            pass: configs.email.auth.pass,
         },
      });
   }

   async sendEmail(payload: EmailNotificationPayload): Promise<void> {
      logger.info(`Sending email to ${payload.to} with subject ${payload.subject}`);
      await this.transporter.sendMail({
         from: payload.from,
         to: payload.to,
         subject: payload.subject,
         html: this.generateEmailTemplate(payload),
      });
   }

   private generateEmailTemplate(payload: EmailNotificationPayload): string {
      return `
         <!DOCTYPE html>
         <html>
            <head>
               <meta charset="utf-8">
               <meta name="viewport" content="width=device-width, initial-scale=1.0">
               <title>${payload.subject}</title>
               <style>
                  body { 
                     font-family: Arial, sans-serif;
                     line-height: 1.6;
                     color: #333333;
                     margin: 0;
                     padding: 0;
                  }
                  .email-container {
                     max-width: 600px;
                     margin: 0 auto;
                     padding: 20px;
                     background-color: #ffffff;
                  }
                  .header {
                     text-align: center;
                     padding: 20px 0;
                     background-color: #f8f9fa;
                     border-radius: 5px;
                  }
                  .content {
                     padding: 20px 0;
                  }
                  .footer {
                     text-align: center;
                     padding: 20px 0;
                     font-size: 12px;
                     color: #666666;
                  }
               </style>
            </head>
            <body>
               <div class="email-container">
                  <div class="header">
                     <h2>${payload.subject}</h2>
                  </div>
                  <div class="content">
                     ${payload.message}
                  </div>
                  <div class="footer">
                     <p>This is an automated message from ${config().base_url}</p>
                     <p>Please do not reply to this email</p>
                  </div>
               </div>
            </body>
         </html>
      `;
   }

}
