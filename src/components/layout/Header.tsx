import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import StorageIcon from '@mui/icons-material/Storage';
import BarChartIcon from '@mui/icons-material/BarChart';

export const Header = () => {
  const location = useLocation();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
          Data Platform
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={RouterLink}
            to="/connections"
            startIcon={<StorageIcon />}
            color={location.pathname === '/connections' ? 'primary' : 'inherit'}
          >
            Connections
          </Button>
          <Button
            component={RouterLink}
            to="/data-visualiser"
            startIcon={<BarChartIcon />}
            color={location.pathname === '/data-visualiser' ? 'primary' : 'inherit'}
          >
            Data Visualiser
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 