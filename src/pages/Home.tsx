import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ShowChart,
  Timeline,
  TrendingUp,
  Analytics,
  Speed,
  DataUsage,
  Assessment,
  CompareArrows,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ShowChart color="primary" />,
      title: 'Market Data Analysis',
      description: 'Transform complex market data into clear, actionable insights'
    },
    {
      icon: <Timeline color="primary" />,
      title: 'Custom Visualizations',
      description: 'Create tailored views of your trading data with flexible column definitions'
    },
    {
      icon: <TrendingUp color="primary" />,
      title: 'Real-time Processing',
      description: 'Process and analyze market data in real-time with instant visualization'
    },
    {
      icon: <Analytics color="primary" />,
      title: 'Multiple Data Sources',
      description: 'Connect to various data sources including APIs, databases, and file systems'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 8,
          borderRadius: 0
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h2" 
                gutterBottom 
                fontWeight="bold"
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2 
                }}
              >
                KETL Trading Data Platform
              </Typography>
              <Typography 
                variant="h5" 
                paragraph 
                sx={{ 
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: '600px' 
                }}
              >
                Streamline your market data analysis with powerful visualization tools
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  onClick={() => navigate('/connections')}
                >
                  Setup Connections
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/visualiser')}
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100'
                    }
                  }}
                >
                  Start Analyzing
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  transform: { md: 'scale(1.2)' }
                }}
              >
                <Speed sx={{ 
                  fontSize: { xs: 200, md: 300 }, 
                  opacity: 0.8 
                }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          fontWeight="bold"
          sx={{ mb: 6 }}
        >
          Platform Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {React.cloneElement(feature.icon, { 
                      sx: { fontSize: 48, color: 'primary.main' } 
                    })}
                  </Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'primary.dark', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} textAlign="center">
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Ready to Get Started?
              </Typography>
              <Typography variant="subtitle1" paragraph sx={{ opacity: 0.9 }}>
                Begin by setting up your data connections and create custom visualizations.
              </Typography>
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/connections')}
                >
                  Setup Connections
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}; 