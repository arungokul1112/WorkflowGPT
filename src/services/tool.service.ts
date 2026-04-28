import { workflowTools } from '../tools/workflow.tools';
import { financeTools } from '../tools/finance.tools';
import { notificationTools } from '../tools/notification.tools';
import { userTools } from '../tools/user.tools';
import logger from '../utils/logger';
import { io } from '../index';

class ToolService {
  private tools: Record<string, any> = {
    ...workflowTools,
    ...financeTools,
    ...notificationTools,
    ...userTools,
  };

  getToolDefinitions() {
    return Object.values(this.tools).map((t) => t.definition);
  }

  async executeTool(name: string, args: any) {
    const tool = this.tools[name];
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }

    try {
      logger.info(`Executing tool: ${name} with args: ${JSON.stringify(args)}`);
      const result = await tool.handler(args);

      // Real-time update via Socket.IO
      if (name === 'sendNotification') {
        io.to(args.userId).emit('notification', result);
        logger.info(`Real-time notification emitted to user: ${args.userId}`);
      }

      return result;
    } catch (error) {
      logger.error(`Error executing tool ${name}:`, error);
      throw error;
    }
  }
}

export default new ToolService();
