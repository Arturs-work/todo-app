import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Test from './pages/Test';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <div className="App">
        <header className="App-header">
          <h1>Todo App</h1>
        </header>
        <main>
          <Test />
        </main>
      </div>
    </>
  );
}

export default App;