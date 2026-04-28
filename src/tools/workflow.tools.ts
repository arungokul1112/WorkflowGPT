import Workflow from '../models/workflow.model';
import logger from '../utils/logger';

export const workflowTools = {
  getPendingApprovals: {
    definition: {
      type: 'function',
      function: {
        name: 'getPendingApprovals',
        description: 'Get all pending workflow approval requests for a user',
        parameters: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'The ID of the user to fetch approvals for' },
          },
          required: ['userId'],
        },
      },
    },
    handler: async (args: { userId: string }) => {
      logger.info(`Fetching pending approvals for user: ${args.userId}`);
      return await Workflow.find({ assignedTo: args.userId, status: 'pending' });
    },
  },

  approveRequest: {
    definition: {
      type: 'function',
      function: {
        name: 'approveRequest',
        description: 'Approve a pending workflow request',
        parameters: {
          type: 'object',
          properties: {
            requestId: { type: 'string', description: 'The ID of the workflow request to approve' },
          },
          required: ['requestId'],
        },
      },
    },
    handler: async (args: { requestId: string }) => {
      try {
        logger.info(`Approving request: ${args.requestId}`);
        const workflow = await Workflow.findByIdAndUpdate(
          args.requestId,
          { status: 'approved' },
          { new: true }
        );
        if (!workflow) return { error: 'Workflow request not found with this ID.' };
        return workflow;
      } catch (error: any) {
        if (error.name === 'CastError') {
          return { error: `Invalid ID format: "${args.requestId}". Please use the actual ID returned by 'getPendingApprovals'.` };
        }
        throw error;
      }
    },
  },

  rejectRequest: {
    definition: {
      type: 'function',
      function: {
        name: 'rejectRequest',
        description: 'Reject a pending workflow request',
        parameters: {
          type: 'object',
          properties: {
            requestId: { type: 'string', description: 'The ID of the workflow request to reject' },
          },
          required: ['requestId'],
        },
      },
    },
    handler: async (args: { requestId: string }) => {
      try {
        logger.info(`Rejecting request: ${args.requestId}`);
        const workflow = await Workflow.findByIdAndUpdate(
          args.requestId,
          { status: 'rejected' },
          { new: true }
        );
        if (!workflow) return { error: 'Workflow request not found with this ID.' };
        return workflow;
      } catch (error: any) {
        if (error.name === 'CastError') {
          return { error: `Invalid ID format: "${args.requestId}". Please use the actual ID returned by 'getPendingApprovals'.` };
        }
        throw error;
      }
    },
  },
};
