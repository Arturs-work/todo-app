import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import TaskCard from './TaskCard';
import { Task } from '../types/Task';
import { useSocket } from '../context/SocketContext';

interface TaskListProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTasksChange }) => {
  const { socket, isConnected } = useSocket();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDeleteTask = (id: string) => {
    if (socket && isConnected) {
      socket.emit('deleteTask', id);
    } else {
      // Fallback to local state if socket is not connected
      const updatedTasks = tasks.filter(task => task.id !== id);
      onTasksChange(updatedTasks);
    }
  };

  const handleToggleComplete = (id: string, itemIndex?: number) => {
    if (socket && isConnected) {
      socket.emit('toggleComplete', id, itemIndex);
    } else {
      // Fallback to local state if socket is not connected
      const updatedTasks = tasks.map(task => {
        if (task.id !== id) return task;
        
        if (task.type === 'checklist' && typeof itemIndex === 'number' && task.completedItems) {
          const newCompletedItems = [...task.completedItems];
          newCompletedItems[itemIndex] = !newCompletedItems[itemIndex];
          return { ...task, completedItems: newCompletedItems };
        }
        
        return task;
      });
      onTasksChange(updatedTasks);
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    if (socket && isConnected) {
      socket.emit('updateTask', updatedTask);
    } else {
      // Fallback to local state if socket is not connected
      const updatedTasks = tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      );
      onTasksChange(updatedTasks);
    }
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{
        mt: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {isLoading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '200px'
        }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Typography 
          variant="h6" 
          color="text.secondary" 
          align="center"
          sx={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          No tasks yet. Create one using the + button!
        </Typography>
      ) : (
        <Box sx={{
          width: '100%',
          columnCount: { xs: 1, sm: 'auto' },
          columnWidth: { sm: '300px' },
          columnGap: 2,
          '& > *': {
            breakInside: 'avoid',
            marginBottom: 2,
            display: 'inline-block',
            width: '100%',
            maxWidth: '100%'
          }
        }}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
              onUpdate={handleUpdateTask}
            />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default TaskList; 