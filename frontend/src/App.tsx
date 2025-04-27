import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider, useSocket } from './context/SocketContext';
import GlobalStyle from './styles/GlobalStyle';
import ThemeToggle from './components/ThemeToggle';
import TaskCreator from './components/TaskCreator';
import TaskList from './components/TaskList';
import { Task } from './types/Task';
import { Typography, Box } from '@mui/material';

const AppContent = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for initial tasks to load
    socket.on('tasks', (initialTasks: Task[]) => {
      setTasks(initialTasks);
    });

    // Listen for task creation events
    socket.on('taskCreated', (newTask: Task) => {
      setTasks(prevTasks => [...prevTasks, newTask]);
    });

    // Listen for task update events
    socket.on('taskUpdated', (updatedTask: Task) => {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    });

    // Listen for task deletion events
    socket.on('taskDeleted', (taskId: string) => {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    });

    // Clean up event listeners on unmount
    return () => {
      socket.off('tasks');
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, [socket]);

  const handleTaskCreated = (task: Task) => {
    if (socket && isConnected) {
      socket.emit('createTask', task);
    } else {
      // Fallback to local state if socket is not connected
      setTasks([...tasks, task]);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Box>
        <Box component="header" sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: 'background.paper',
          boxShadow: 3
        }}>
          <Typography variant="h6" gutterBottom>
            Todo App
          </Typography>
          <ThemeToggle />
        </Box>
        
        <TaskList 
          tasks={tasks}
          onTasksChange={setTasks}
        />
        
        <TaskCreator onTaskCreated={handleTaskCreated} />
      </Box>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;