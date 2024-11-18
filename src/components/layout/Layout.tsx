import React, { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Divider,
  Avatar,
  useTheme,
} from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface LayoutProps {
  children: React.ReactNode;
  onFeatureSelect: (feature: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Connections', icon: <CompareArrowsIcon />, path: '/connections' },
    { text: 'Data Visualiser', icon: <BarChartIcon />, path: '/visualiser' },
    { text: 'Data Mapper', icon: <AccountTreeIcon />, path: '/mapper' }
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
          boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                letterSpacing: 1,
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              KETL
            </Typography>
          </Box>

          {/* Header Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  textTransform: 'none',
                  borderBottom: isActivePath(item.path) ? '2px solid white' : 'none',
                  borderRadius: 0,
                  px: 2
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%)'
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Navigation
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>

        <Divider />

        <List sx={{ p: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                navigate(item.path);
                setDrawerOpen(false);
              }}
              sx={{
                mb: 1,
                borderRadius: 1,
                bgcolor: isActivePath(item.path) ? 'primary.light' : 'transparent',
                color: isActivePath(item.path) ? 'primary.main' : 'text.primary',
                '&:hover': {
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: isActivePath(item.path) ? 'primary.main' : 'text.secondary',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: isActivePath(item.path) ? 600 : 400
                }}
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ p: 2, mt: 'auto' }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            KETL v1.0.0
          </Typography>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          minHeight: '100vh',
          bgcolor: '#f5f7fa'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}; 