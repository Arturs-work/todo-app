import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        res.status(200).json({ status: 'ok' });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ status: 'error', message: errorMessage });
      }
});

export default router; 