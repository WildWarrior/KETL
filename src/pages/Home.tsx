import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  useTheme
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Data Connections',
      description: 'Connect and integrate data from multiple trading systems and data sources',
      icon: <CompareArrowsIcon sx={{ fontSize: 40 }} />,
      path: '/connections'
    },
    {
      title: 'Data Visualiser',
      description: 'Visualize and analyze your commodity trading data with interactive charts',
      icon: <BarChartIcon sx={{ fontSize: 40 }} />,
      path: '/visualiser'
    },
    {
      title: 'Data Mapper',
      description: 'Create and manage field mappings between different data schemas',
      icon: <AccountTreeIcon sx={{ fontSize: 40 }} />,
      path: '/mapper'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                KETL
              </Typography>
              <Typography variant="h5" gutterBottom>
                Data Transformation Tool for Commodities Trading
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Streamline your data transformation processes in commodities trading and risk management with our powerful ETL tool.
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                size="large"
                onClick={() => navigate('/mapper')}
                sx={{ mr: 2 }}
              >
                Get Started
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* You can add an illustration or diagram here */}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
                    cursor: 'pointer'
                  }
                }}
                onClick={() => navigate(feature.path)}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
            Why Choose KETL?
          </Typography>
          <Grid container spacing={4}>
            {[
              'Specialized for commodities trading',
              'Intuitive data mapping interface',
              'Real-time data transformation',
              'Advanced data validation',
              'Comprehensive audit trails',
              'Secure data handling'
            ].map((benefit) => (
              <Grid item xs={12} sm={6} md={4} key={benefit}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                >
                  <Typography>{benefit}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}; 