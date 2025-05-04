import { Sequelize } from 'sequelize';

if (process.env.NODE_ENV !== "production") {
  import("dotenv").then((dotenv) => dotenv.config());
}

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    return {
      success: true,
      message: 'Works...',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Crap:', error);
    return {
      success: false,
      message: 'Fix it...',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
};

// Sync database
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force: force });
    console.log('Database synchronized successfully');
    return true;
  } catch (error) {
    console.error('Error synchronizing database:', error);
    return false;
  }
};

// Initialize database
export const initializeDatabase = async () => {
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

export default sequelize; 