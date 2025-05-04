import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initializeDatabase } from './config/sequelize';
import healthRouter from './routes/health';
import { registerSocketHandlers } from './sockets/registerSocketHandlers';

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

(async () => {
    // Register your socket listeners
    registerSocketHandlers(io);
  
    // Start server
    httpServer.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        initializeDatabase();
    }); 
})();
