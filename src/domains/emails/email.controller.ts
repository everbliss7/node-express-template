import { Request, Response } from 'express';
import { z } from 'zod';

import logger from '@libs/logger';

import EmailNotificationService from '@domains/emails/email-notification.service';
import prisma from '@libs/prisma';
import { UserRole } from '@prisma/client';

export default class EmailController {
   static async sendWelcomeEmail(req: Request, res: Response) {
      const { user_id } = req.query;

      if (!user_id) {
         logger.error('User ID is required');
         return res.status(400).json({ message: 'User ID is required' });
      }

      // Create dummy user
      // const user = await prisma.user.findUnique({
      //    where: {
      //       id: user_id as string
      //    }
      // });

      // console.log({user});

      const dummyUser = {
         id: '123e4567-e89b-12d3-a456-426614174000',
         clerk_id: 'user_123',
         email: 'everbliss7@gmail.com',
         first_name: 'Ever',
         last_name: 'Bliss',
         role: UserRole.CLIENT,
         created_at: new Date(),
         updated_at: new Date()
      }

      if (!dummyUser) {
         logger.error('User not found');
         return res.status(404).json({ message: 'User not found' });
      }

      const emailNotificationService = new EmailNotificationService();
      await emailNotificationService.sendWelcomeEmail({
         ...dummyUser,
         intermediary_id: null
      });

      return res.status(200).json({ message: 'Sending email...' });
   }
}
