import llmService from './llm.service';
import toolService from './tool.service';
import memoryService from '../memory/memory.service';
import logger from '../utils/logger';

class AgentService {
  async processMessage(userId: string, userMessage: string) {
    const conversation = await memoryService.getConversation(userId);
    
    // Add user message to memory
    await memoryService.addMessage(userId, { role: 'user', content: userMessage });
    
    // Use the messages from the conversation (which includes the system prompt)
    let currentMessages = [...conversation.messages, { role: 'user', content: userMessage }];
    const tools = toolService.getToolDefinitions();

    let iterations = 0;
    const maxIterations = 5; // Prevent infinite loops

    const actions: any[] = [];

    while (iterations < maxIterations) {
      iterations++;
      
      const response = await llmService.getChatCompletion(currentMessages as any, tools);
      
      let toolCalls = response.tool_calls || [];

      // Fallback: Check if AI outputted JSON instead of using native tool_calls
      if (toolCalls.length === 0 && response.content?.trim().startsWith('{')) {
        try {
          const possibleTool = JSON.parse(response.content.trim());
          if (possibleTool.name && (possibleTool.parameters || possibleTool.arguments)) {
            logger.info('Detected JSON tool call in content. Converting to native format.');
            toolCalls = [{
              id: `call_${Date.now()}`,
              type: 'function',
              function: {
                name: possibleTool.name,
                arguments: JSON.stringify(possibleTool.parameters || possibleTool.arguments)
              }
            }];
          }
        } catch (e) {
          // Not valid JSON or not a tool call, continue as normal
        }
      }
      
      if (toolCalls.length === 0) {
        const finalContent = response.content || "Operation completed.";
        await memoryService.addMessage(userId, { 
          role: 'assistant', 
          content: finalContent
        });
        return { reply: finalContent, actions };
      }

      // Add assistant tool call message to context
      const assistantMsg = {
        role: 'assistant' as const,
        content: response.content || '',
        tool_calls: toolCalls
      };
      
      currentMessages.push(assistantMsg as any);
      await memoryService.addMessage(userId, assistantMsg);

      for (const toolCall of toolCalls) {
        const { name, arguments: argsString } = toolCall.function;
        const args = JSON.parse(argsString);
        
        // Execute tool
        const result = await toolService.executeTool(name, args);
        actions.push({ tool: name, args, result });

        const toolMessage = {
          role: 'tool' as const,
          tool_call_id: toolCall.id,
          name: name,
          content: JSON.stringify(result),
        };

        currentMessages.push(toolMessage as any);
        await memoryService.addMessage(userId, toolMessage);
      }
    }

    return { reply: "I reached my iteration limit. Please try again.", actions: [] };
  }
}

export default new AgentService();
