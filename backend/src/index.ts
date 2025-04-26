import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/sequelize';
import { syncDatabase } from './models';
import taskRoutes from './routes/tasks';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Task routes
app.use('/api/tasks', taskRoutes);

// Initialize database
const initializeDatabase = async () => {
  try {
    // Test connection
    const connectionResult = await testConnection();
    if (!connectionResult.success) {
      console.error('Database connection failed:', connectionResult.error);
      return;
    }
    
    // Sync database (create tables)
    const syncResult = await syncDatabase(false);
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
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  initializeDatabase();
}); 