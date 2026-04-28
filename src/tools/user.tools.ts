import User from '../models/user.model';
import logger from '../utils/logger';

export const userTools = {
  getUserInfo: {
    definition: {
      type: 'function',
      function: {
        name: 'getUserInfo',
        description: 'Get detailed information about a user',
        parameters: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'The ID of the user to fetch' },
          },
          required: ['userId'],
        },
      },
    },
    handler: async (args: { userId: string }) => {
      logger.info(`Fetching info for user: ${args.userId}`);
      let user = await User.findOne({ userId: args.userId });
      
      // Seed a dummy user if not found for demo
      if (!user) {
        user = await User.create({
          userId: args.userId,
          name: 'Demo User',
          email: `${args.userId}@example.com`,
          department: 'Engineering',
          role: 'Developer'
        });
      }
      return user;
    },
  },

  updateUserInfo: {
    definition: {
      type: 'function',
      function: {
        name: 'updateUserInfo',
        description: 'Update user profile information like name, department, or role',
        parameters: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'The ID of the user to update' },
            name: { type: 'string', description: 'New name for the user' },
            email: { type: 'string', description: 'New email for the user' },
            department: { type: 'string', description: 'New department' },
            role: { type: 'string', description: 'New role' },
            status: { type: 'string', enum: ['active', 'inactive'], description: 'New status' },
          },
          required: ['userId'],
        },
      },
    },
    handler: async (args: any) => {
      const { userId, ...updateData } = args;
      logger.info(`Updating info for user: ${userId}`);
      
      const user = await User.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true, upsert: true }
      );
      
      return {
        success: true,
        message: `User ${userId} updated successfully.`,
        data: user
      };
    },
  },
};
