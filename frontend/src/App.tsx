import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import GlobalStyle from './styles/GlobalStyle';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { Box } from '@mui/material';
import { getBoardId } from './services/boardService';
import { useTaskSync } from './hooks/useTaskSync';
import Header from './components/Header';

const AppContent = () => {
  const boardId = getBoardId();
  const { tasks, setTasks, handleCreate, handleUpdate, handleDelete } = useTaskSync(boardId);

  return (
    <>
      <GlobalStyle />
      <Box>
        <Header />
        <TaskList 
          tasks={tasks}
          onTasksChange={setTasks}
          onTaskUpdated={handleUpdate}
          onTaskDeleted={handleDelete}
        />
        <TaskForm onTaskCreated={handleCreate} />
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