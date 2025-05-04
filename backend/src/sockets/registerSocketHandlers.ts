import { Server, Socket } from 'socket.io';
import Task from '../models/Task';

export const registerSocketHandlers = (io: Server) => {
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
};