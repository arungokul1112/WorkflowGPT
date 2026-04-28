import { Request, Response, NextFunction } from 'express';
import agentService from '../services/agent.service';
import logger from '../utils/logger';

export class ChatController {
  /**
   * @openapi
   * /chat:
   *   post:
   *     summary: Send a message to the AI agent
   *     tags: [Chat]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - userId
   *               - message
   *             properties:
   *               userId:
   *                 type: string
   *                 example: user_123
   *               message:
   *                 type: string
   *                 example: Show my pending approvals
   *     responses:
   *       200:
   *         description: AI response with tool actions
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 reply:
   *                   type: string
   *                 actions:
   *                   type: array
   *                   items:
   *                     type: object
   */
  async handleChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, message } = req.body;

      if (!userId || !message) {
        return res.status(400).json({ error: 'userId and message are required' });
      }

      logger.info(`Processing chat request for user: ${userId}`);
      const result = await agentService.processMessage(userId, message);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatController();
