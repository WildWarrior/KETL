import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ConnectionCard } from '../components/connections/ConnectionCard';
import { useConnections } from '../context/ConnectionContext';

export const Connections = () => {
  const { connections } = useConnections();

  return (
    <Box sx={{ p: 3, maxWidth: 'lg', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Data Connections
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* Handle new connection */}}
        >
          New Connection
        </Button>
      </Box>

      <Grid container spacing={3}>
        {connections.map((connection) => (
          <Grid item xs={12} md={6} key={connection.id}>
            <ConnectionCard connection={connection} />
          </Grid>
        ))}
      </Grid>

      {connections.length === 0 && (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            bgcolor: 'grey.50'
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No connections yet
          </Typography>
          <Typography color="text.secondary" paragraph>
            Start by adding a new data connection
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {/* Handle new connection */}}
          >
            Add Connection
          </Button>
        </Paper>
      )}
    </Box>
  );
};