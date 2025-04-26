import React, { createContext, useState, useMemo, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme, ThemeMode, ThemeContextType } from './theme';

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleColorMode: () => {},
  theme: lightTheme,
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  
  const theme = useMemo(() => 
    mode === 'light' ? lightTheme : darkTheme,
    [mode]
  );
  
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const contextValue = useMemo(() => ({
    mode,
    toggleColorMode,
    theme,
  }), [mode, theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);

  return context;
}; 