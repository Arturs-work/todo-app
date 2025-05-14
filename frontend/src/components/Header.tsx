import React from 'react';
import { Typography, Box } from '@mui/material';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => (
  <Box component="header" sx={{
    p: 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    bgcolor: 'background.paper',
    boxShadow: 3
  }}>
    <Typography variant="h6" gutterBottom>Todo App</Typography>
    <ThemeToggle />
  </Box>
);

export default Header;