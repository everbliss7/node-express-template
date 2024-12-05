import { NotificationStatus } from '@prisma/client';

import prisma from '@libs/prisma';
import { EmailNotificationInputDTO } from '@domains/emails/types';

export default class EmailNotificationModel {
   static async create(emailNotification: EmailNotificationInputDTO) {
      return await prisma.emailNotification.create({ data: emailNotification });
   }

   static async markNotificationAsSent(id: string) {
      return await prisma
      .emailNotification
      .update({ where: { id }, 
         data: { 
            status: NotificationStatus.SENT, 
            sent_at: new Date() 
         } 
      });
   }

   static async markNotificationAsFailed(id: string) {
      return await prisma
      .emailNotification
      .update({ where: { id }, 
         data: { status: NotificationStatus.FAILED } 
      });
   }
}
