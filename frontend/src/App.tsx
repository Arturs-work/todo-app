import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider, useSocket } from './context/SocketContext';
import GlobalStyle from './styles/GlobalStyle';
import ThemeToggle from './components/ThemeToggle';
import TaskCreator from './components/TaskCreator';
import TaskList from './components/TaskList';
import { Task } from './types/Task';
import { Typography, Box } from '@mui/material';

const STORAGE_KEY = 'todo-app-tasks';

const AppContent = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingChanges, setPendingChanges] = useState<{
    create: Task[];
    update: Task[];
    delete: string[];
  }>({
    create: [],
    update: [],
    delete: []
  });
  const { socket, isConnected } = useSocket();

  // Load tasks from localStorage on initial mount
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Sync pending changes when connection is restored
  useEffect(() => {
    if (isConnected && socket) {
      // Sync created tasks
      pendingChanges.create.forEach(task => {
        socket.emit('createTask', task);
      });

      // Sync updated tasks
      pendingChanges.update.forEach(task => {
        socket.emit('updateTask', task);
      });

      // Sync deleted tasks
      pendingChanges.delete.forEach(taskId => {
        socket.emit('deleteTask', taskId);
      });

      // Clear pending changes after syncing
      setPendingChanges({
        create: [],
        update: [],
        delete: []
      });
    }
  }, [isConnected, socket, pendingChanges]);

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
      // Add to local state and pending changes
      setTasks(prevTasks => [...prevTasks, task]);
      setPendingChanges(prev => ({
        ...prev,
        create: [...prev.create, task]
      }));
    }
  };

  const handleTaskUpdated = (task: Task) => {
    if (socket && isConnected) {
      socket.emit('updateTask', task);
    } else {
      // Update local state and add to pending changes
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === task.id ? task : t)
      );
      setPendingChanges(prev => ({
        ...prev,
        update: [...prev.update, task]
      }));
    }
  };

  const handleTaskDeleted = (taskId: string) => {
    if (socket && isConnected) {
      socket.emit('deleteTask', taskId);
    } else {
      // Update local state and add to pending changes
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      setPendingChanges(prev => ({
        ...prev,
        delete: [...prev.delete, taskId]
      }));
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
            Todo App {!isConnected && '(Offline)'}
          </Typography>
          <ThemeToggle />
        </Box>
        
        <TaskList 
          tasks={tasks}
          onTasksChange={setTasks}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
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