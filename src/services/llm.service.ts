import Groq from 'groq-sdk';
import { aiConfig } from '../config/ai.config';
import logger from '../utils/logger';

const groq = new Groq({
  apiKey: aiConfig.groqApiKey,
});

export interface IChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: any[];
}

export class LLMService {
  async getChatCompletion(messages: IChatMessage[], tools: any[]) {
    try {
      logger.info('Sending request to Groq LLM');
      
      // Sanitize messages to remove extra properties like _id from Mongoose
      const sanitizedMessages = messages.map(({ role, content, name, tool_call_id, tool_calls }) => {
        const msg: any = { role, content: content || '' };
        if (name) msg.name = name;
        if (tool_call_id) msg.tool_call_id = tool_call_id;
        if (tool_calls) msg.tool_calls = tool_calls;
        return msg;
      });

      const response = await groq.chat.completions.create({
        model: aiConfig.modelName,
        messages: sanitizedMessages,
        tools: tools.length > 0 ? tools : undefined,
        tool_choice: tools.length > 0 ? 'auto' : undefined,
        temperature: aiConfig.temperature,
        max_tokens: aiConfig.maxTokens,
      });

      return response.choices[0].message;
    } catch (error) {
      logger.error('Error in Groq LLM Service:', error);
      throw error;
    }
  }
}

export default new LLMService();
