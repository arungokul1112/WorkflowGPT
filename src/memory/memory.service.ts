import Conversation, { IMessage } from '../models/conversation.model';
import logger from '../utils/logger';

class MemoryService {
  async getConversation(userId: string) {
    let conversation = await Conversation.findOne({ userId });
    
    if (!conversation) {
      logger.info(`Creating new conversation for user: ${userId}`);
      conversation = await Conversation.create({
        userId,
        messages: [
          {
            role: 'system',
            content: `You are a powerful Workflow Automation Agent. 
            
            CORE CAPABILITIES:
            1. You can manage approvals, track finance data, and send notifications using the provided tools.
            2. ALWAYS use the native tool-calling JSON format. DO NOT use XML tags like <function> or <call>.
            
            RULES:
            - NEVER hallucinate IDs. Only use IDs returned by tools.
            - If a user asks to approve/reject something, you MUST first call 'getPendingApprovals' to find the correct ID.
            - If you can't find an item, ask the user for clarification.
            - Be concise, professional, and efficient.`,
          },
        ],
      });
    }
    
    return conversation;
  }

  async addMessage(userId: string, message: IMessage) {
    return await Conversation.findOneAndUpdate(
      { userId },
      { $push: { messages: message } },
      { new: true }
    );
  }

  async clearHistory(userId: string) {
    return await Conversation.deleteOne({ userId });
  }
}

export default new MemoryService();
