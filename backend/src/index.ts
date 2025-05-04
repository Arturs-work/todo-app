import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { testConnection } from './config/sequelize';
import { syncDatabase } from './models';
import Task from './models/Task';
import healthRouter from './routes/health';

if (process.env.NODE_ENV !== "production") {
  import("dotenv").then((dotenv) => dotenv.config());
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/health', healthRouter);

io.on('connection', (socket) => {
  console.log('Client connected');

  // Join a specific board room
  socket.on('joinBoard', async (boardId: string) => {
    socket.join(boardId);
    
    // Send them all the tasks for this board
    const tasks = await Task.findAll({
      where: { boardId },
      order: [['order', 'ASC']]
    });
    socket.emit('tasks', tasks);
  });

  // Handle task creation
  socket.on('createTask', async (taskData: { 
    type: string; 
    title: string; 
    content: string | string[];
    boardId: string;
    pinned: boolean;
  }) => {
    try {
      console.log('creating task...', taskData);
      const task = await Task.create({
        ...taskData,
        createdAt: new Date()
      });
      io.to(taskData.boardId).emit('taskCreated', task);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  });

  // Handle task updates
  socket.on('updateTask', async (taskData: { 
    id: string; 
    type: string; 
    title: string; 
    content?: string | string[];
    pinned?: boolean;
    order: number;
    boardId: string;
  }) => {
    try {
      console.log('updating task...', taskData);
      const task = await Task.findByPk(taskData.id);
      if (task) {
        await task.update(taskData);
        io.to(taskData.boardId).emit('taskUpdated', task);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  });

  // Handle task deletion
  socket.on('deleteTask', async (taskData: { id: string; boardId: string }) => {
    try {
      const task = await Task.findByPk(taskData.id);
      if (task) {
        await task.destroy();
        io.to(taskData.boardId).emit('taskDeleted', taskData.id);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Initialize database
const initializeDatabase = async () => {
  try {
    // Test connection
    const connectionResult = await testConnection();
    if (!connectionResult.success) {
      console.error('Database connection failed:', connectionResult.error);
      return;
    }
    
    // Sync database and create tables if needed
    const forceSync = process.env.FORCE_SYNC === 'true';
    const syncResult = await syncDatabase(forceSync);
    if (!syncResult) {
      console.error('Database synchronization failed');
      return;
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Start server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  initializeDatabase();
}); 