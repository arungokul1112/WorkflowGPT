import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './config/db.config';
import chatRoutes from './routes/chat.routes';
import { errorHandler } from './utils/errorHandler';
import logger from './utils/logger';
import { swaggerSpec } from './config/swagger.config';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/chat', chatRoutes);

// Socket.IO
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);
  
  socket.on('join', (userId: string) => {
    socket.join(userId);
    logger.info(`User ${userId} joined their notification room.`);
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'AI Workflow Automation Agent API is running with Socket.IO support.' });
});

// Error handling
app.use(errorHandler);

httpServer.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export { io };
