import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import GlobalStyle from './styles/GlobalStyle';
import ThemeToggle from './components/ThemeToggle';
import TaskCreator from './components/TaskCreator';
import TaskList from './components/TaskList';
import { Task } from './types/Task';
import { Typography, Box } from '@mui/material';

const AppContent = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleTaskCreated = (task: Task) => {
    setTasks([...tasks, task]);
  };

  return (
    <>
      <GlobalStyle />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box component="header" sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: 'background.paper',
          boxShadow: 3
        }}>
          <Typography component="h1">
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
      <AppContent />
    </ThemeProvider>
  );
}

export default App;