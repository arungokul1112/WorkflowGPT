import Transaction from '../models/transaction.model';
import logger from '../utils/logger';

export const financeTools = {
  getUserTransactions: {
    definition: {
      type: 'function',
      function: {
        name: 'getUserTransactions',
        description: 'Get all financial transactions for a user',
        parameters: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'The ID of the user' },
          },
          required: ['userId'],
        },
      },
    },
    handler: async (args: { userId: string }) => {
      logger.info(`Fetching transactions for user: ${args.userId}`);
      return await Transaction.find({ userId: args.userId }).sort({ createdAt: -1 });
    },
  },

  getTotalSpending: {
    definition: {
      type: 'function',
      function: {
        name: 'getTotalSpending',
        description: 'Calculate the total amount spent by a user',
        parameters: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'The ID of the user' },
          },
          required: ['userId'],
        },
      },
    },
    handler: async (args: { userId: string }) => {
      logger.info(`Calculating total spending for user: ${args.userId}`);
      const transactions = await Transaction.find({ userId: args.userId, type: 'debit' });
      const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
      return { total, count: transactions.length };
    },
  },

  addTransaction: {
    definition: {
      type: 'function',
      function: {
        name: 'addTransaction',
        description: 'Record a new financial transaction (credit or debit)',
        parameters: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'The ID of the user' },
            amount: { type: 'number', description: 'The amount of the transaction' },
            type: { type: 'string', enum: ['credit', 'debit'], description: 'Type of transaction' },
            category: { type: 'string', description: 'Category (e.g. Salary, Food, Utilities)' },
            description: { type: 'string', description: 'Description of the transaction' },
          },
          required: ['userId', 'amount', 'type', 'category'],
        },
      },
    },
    handler: async (args: any) => {
      logger.info(`Adding new transaction for user: ${args.userId}`);
      const transaction = await Transaction.create(args);
      return {
        success: true,
        message: 'Transaction recorded successfully',
        data: transaction
      };
    },
  },
};
