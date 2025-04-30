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

export default sequelize; 