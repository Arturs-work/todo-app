import sequelize from '../config/sequelize';
import Task from './Task';

// Initialize models
const models = {
  Task,
};

// Sync database
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Database synchronized successfully');
    return true;
  } catch (error) {
    console.error('Error synchronizing database:', error);
    return false;
  }
};

export default models; 