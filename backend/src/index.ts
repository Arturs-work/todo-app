import express, { Request, Response } from 'express';
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

io.on('connection', async (socket) => {
  console.log('Client connected:', socket.id);

  try {
    const tasks = await Task.findAll({
      order: [['order', 'ASC']]
    });
    socket.emit('tasks', tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    socket.emit('error', { message: 'Failed to fetch tasks' });
  }

  // Handle task creation
  socket.on('createTask', async (task) => {
    try {
      // Get the current highest order
      const maxOrderTask = await Task.findOne({
        order: [['order', 'DESC']]
      });
      const nextOrder = maxOrderTask ? maxOrderTask.order + 1 : 0;

      // Create the new task with the next order
      const newTask = await Task.create({
        ...task,
        order: nextOrder
      });
      
      io.emit('taskCreated', newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      socket.emit('error', { message: 'Failed to create task' });
    }
  });

  // Handle task update
  socket.on('updateTask', async (task) => {
    try {
      const [updated] = await Task.update(task, {
        where: { id: task.id },
      });
      
      if (updated) {
        const updatedTask = await Task.findByPk(task.id);
        io.emit('taskUpdated', updatedTask);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      socket.emit('error', { message: 'Failed to update task' });
    }
  });

  // Handle task deletion
  socket.on('deleteTask', async (taskId) => {
    try {
      const deleted = await Task.destroy({
        where: { id: taskId },
      });
      
      if (deleted) {
        io.emit('taskDeleted', taskId);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      socket.emit('error', { message: 'Failed to delete task' });
    }
  });

  // Handle task completion toggle
  socket.on('toggleComplete', async (taskId, itemIndex) => {
    try {
      const task = await Task.findByPk(taskId);
      
      if (task && task.type === 'checklist' && task.completedItems) {
        const completedItems = [...task.completedItems];
        completedItems[itemIndex] = !completedItems[itemIndex];
        
        const updated = await Task.update(
          { completedItems },
          { where: { id: taskId } }
        );
        
        if (updated[0]) {
          const updatedTask = await Task.findByPk(taskId);
          io.emit('taskUpdated', updatedTask);
        }
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      socket.emit('error', { message: 'Failed to toggle task completion' });
    }
  });

  // Handle task reordering
  socket.on('reorderTasks', async (taskIds: string[]) => {
    try {
      await Promise.all(
        taskIds.map(async (taskId, index) => {
          await Task.update(
            { order: index },
            { where: { id: taskId } }
          );
        })
      );

      const tasks = await Task.findAll({
        order: [['order', 'ASC']]
      });

      io.emit('tasks', tasks);
    } catch (error) {
      console.error('Error reordering tasks:', error);
      socket.emit('error', { message: 'Failed to reorder tasks' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
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