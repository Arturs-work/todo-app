import { createTheme, Theme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light'
  }
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  mode: ThemeMode;
  toggleColorMode: () => void;
  theme: Theme;
} 