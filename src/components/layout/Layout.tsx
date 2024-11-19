import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  ListItemButton,
  Button,
  useTheme
} from '@mui/material';
import { 
  Home as HomeIcon,
  Storage as ConnectionsIcon,
  BarChart as VisualizerIcon,
  CompareArrows as MapperIcon,
  Menu as MenuIcon 
} from '@mui/icons-material';

const drawerWidth = 240;

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    { path: '/', label: 'Home', icon: <HomeIcon /> },
    { path: '/connections', label: 'Connections', icon: <ConnectionsIcon /> },
    { path: '/visualiser', label: 'Data Visualiser', icon: <VisualizerIcon /> },
    { path: '/mapper', label: 'Data Mapper', icon: <MapperIcon /> }
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box sx={{ mt: 8 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.path} 
            disablePadding
            sx={{ 
              '& .MuiListItemButton-root': {
                minHeight: 48,
                px: 2.5,
              }
            }}
          >
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={() => setDrawerOpen(false)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  '&:hover': {
                    bgcolor: 'primary.light',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                    fontWeight: 'bold',
                  }
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  sx: { 
                    fontSize: '0.875rem',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: theme.palette.primary.main,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              flexGrow: 1,
              fontWeight: 600
            }}
          >
            KETL
          </Typography>
          
          {/* Desktop navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {menuItems.map((item) => (
              <Button 
                key={item.path}
                color="inherit" 
                component={Link} 
                to={item.path}
                sx={{ 
                  borderBottom: location.pathname === item.path ? 2 : 0,
                  borderColor: 'white',
                  textTransform: 'none',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  '&:hover': {
                    borderBottom: 2,
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.default',
            borderRight: '1px solid',
            borderColor: 'divider'
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          minHeight: '100vh',
          mt: 8,
          bgcolor: 'background.default'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};