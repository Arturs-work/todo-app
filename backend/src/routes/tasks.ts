import express, { Request, Response } from 'express';
import Task from '../models/Task';

const router = express.Router();

// Get all tasks
router.get('/', async (_req: Request, res: Response) => {
  try {
    const tasks = await Task.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);

    res.status(500).json({ 
      error: 'Failed to fetch tasks',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 