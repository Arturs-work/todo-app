import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider, useSocket } from './context/SocketContext';
import GlobalStyle from './styles/GlobalStyle';
import ThemeToggle from './components/ThemeToggle';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { Task } from './types/Task';
import { Typography, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

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

  const { socket, isConnected, currentBoardId, joinBoard } = useSocket();

  // Get boardId from URL or generate a new one
  const getBoardId = () => {
    const pathParts = window.location.pathname.split('/');
    const boardId = pathParts[1];
    
    if (!boardId) {
      const newBoardId = uuidv4();
      window.history.pushState({}, '', `/${newBoardId}`);
      return newBoardId;
    }
    
    return boardId;
  };

  const boardId = getBoardId();

  useEffect(() => {
    // Join the board room when the boardId changes
    if (boardId !== currentBoardId) {
      joinBoard(boardId);
    }
  }, [boardId, currentBoardId, joinBoard]);

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
      setTasks(prevTasks => {
        const newTasks = prevTasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )

        return newTasks.sort((a, b) => a.order - b.order);
    });
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
      socket.emit('createTask', { ...task, boardId });
    } else {
      // Add to local state and pending changes
      setTasks(prevTasks => [...prevTasks, task]);
      setPendingChanges(prev => ({
        ...prev,
        create: [...prev.create, { ...task, boardId }]
      }));
    }
  };

  const handleTaskUpdated = (task: Task) => {
    if (socket && isConnected) {
      socket.emit('updateTask', { ...task, boardId });
    } else {
      // Update local state and add to pending changes
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === task.id ? task : t)
      );
      setPendingChanges(prev => ({
        ...prev,
        update: [...prev.update, { ...task, boardId }]
      }));
    }
  };

  const handleTaskDeleted = (taskId: string) => {
    if (socket && isConnected) {
      socket.emit('deleteTask', { id: taskId, boardId });
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
            Todo App
          </Typography>
          <ThemeToggle />
        </Box>
        
        <TaskList 
          tasks={tasks}
          onTasksChange={setTasks}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
        
        <TaskForm onTaskCreated={handleTaskCreated} />
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