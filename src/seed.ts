import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Workflow from './models/workflow.model';
import Transaction from './models/transaction.model';
import Notification from './models/notification.model';
import Conversation from './models/conversation.model';
import logger from './utils/logger';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/workflow_gpt';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('Connected to MongoDB for seeding...');

    // Clear existing data
    await Workflow.deleteMany({});
    await Transaction.deleteMany({});
    await Notification.deleteMany({});
    await Conversation.deleteMany({});
    logger.info('Cleared existing data.');

    const userId = 'user_123';

    // Seed Workflows
    await Workflow.create([
      { title: 'MacBook Pro M3 Max Request', status: 'pending', createdBy: 'alice_eng', assignedTo: userId, amount: 3500 },
      { title: 'JetBrains IDE License', status: 'pending', createdBy: 'bob_dev', assignedTo: userId, amount: 250 },
      { title: 'AWS Credits Top-up', status: 'pending', createdBy: 'charlie_ops', assignedTo: userId, amount: 5000 },
      { title: 'Ergonomic Desk', status: 'pending', createdBy: 'diana_hr', assignedTo: userId, amount: 800 },
      { title: 'Team Dinner Reimbursement', status: 'pending', createdBy: 'eve_mkt', assignedTo: userId, amount: 120 },
      { title: 'Conference Ticket: AI Summit', status: 'pending', createdBy: 'frank_ai', assignedTo: userId, amount: 1500 },
    ]);

    // Seed Transactions
    await Transaction.create([
      { userId, amount: 5000, type: 'credit', description: 'Monthly Salary' },
      { userId, amount: 150, type: 'debit', description: 'Internet Subscription' },
      { userId, amount: 45, type: 'debit', description: 'Starbucks Coffee' },
      { userId, amount: 1200, type: 'debit', description: 'Rent' },
      { userId, amount: 80, type: 'debit', description: 'Electricity Bill' },
      { userId, amount: 200, type: 'debit', description: 'Grocery Store' },
      { userId, amount: 500, type: 'credit', description: 'Freelance Bonus' },
      { userId, amount: 300, type: 'debit', description: 'Flight Ticket' },
      { userId, amount: 60, type: 'debit', description: 'Gym Membership' },
    ]);

    logger.info('Seed data created successfully.');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
