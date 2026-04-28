import Notification from '../models/notification.model';
import logger from '../utils/logger';

export const notificationTools = {
  sendNotification: {
    definition: {
      type: 'function',
      function: {
        name: 'sendNotification',
        description: 'Send a notification message to a user',
        parameters: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'The ID of the user' },
            message: { type: 'string', description: 'The notification message' },
          },
          required: ['userId', 'message'],
        },
      },
    },
    handler: async (args: { userId: string; message: string }) => {
      logger.info(`Sending notification to user ${args.userId}: ${args.message}`);
      const notification = await Notification.create({
        userId: args.userId,
        message: args.message,
      });
      return notification;
    },
  },
};
