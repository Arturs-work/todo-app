import React from 'react';
import Test from './pages/Test';
import { ThemeProvider, useTheme } from './ThemeContext';
import GlobalStyle from './styles/GlobalStyle';
import ThemeToggle from './components/ThemeToggle';
import TaskSpeedDial from './components/TaskSpeedDial';

const AppContent = () => {
  return (
    <>
      <GlobalStyle />
      <div className="App">
        <header className="App-header">
          <h1>Todo App</h1>
          <ThemeToggle />
        </header>
        <main>
          <Test />
        </main>
        
        <TaskSpeedDial />
      </div>
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