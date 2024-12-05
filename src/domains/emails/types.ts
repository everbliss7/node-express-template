import { EmailNotificationType, NotificationStatus } from "@prisma/client";

export interface EmailNotificationInputDTO {
   type: EmailNotificationType;
   recipient_id: string;
   message: string;
}

export interface EmailNotificationPayload {
   to: string | string[];
   from: string;
   subject: string;
   message: string;
   data?: any;
}
