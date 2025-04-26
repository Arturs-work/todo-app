import React from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Box from '@mui/material/Box';
import { useTheme } from '../ThemeContext';

const ThemeToggle: React.FC = () => {
  const { mode, toggleColorMode } = useTheme();
  
  return (
    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
      <IconButton onClick={toggleColorMode} color="inherit">
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );
};

export default ThemeToggle; 