import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Container
} from '@mui/material';
import { useConnections } from '../context/ConnectionContext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StorageIcon from '@mui/icons-material/Storage';
import HttpIcon from '@mui/icons-material/Http';
import FolderZipIcon from '@mui/icons-material/FolderZip';

export const DataVisualiser = () => {
  const { connections } = useConnections();
  const [selectedConnection, setSelectedConnection] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const handleFetchData = async () => {
    if (!selectedConnection) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const connection = connections.find(c => c.id === selectedConnection);
      if (!connection) throw new Error('Connection not found');

      let response;
      switch (connection.type) {
        case 'api':
          response = await fetchApiData(connection);
          break;
        case 'database':
          response = await fetchDatabaseData(connection);
          break;
        case 'sftp':
          response = await fetchSftpData(connection);
          break;
        default:
          throw new Error('Unsupported connection type');
      }
      
      setResponse(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApiData = async (connection: any) => {
    const { baseUrl, authType, apiKey, bearerToken, username, password, headers: rawHeaders } = connection;
    
    // Prepare headers
    const headers: Record<string, string> = {};
    if (rawHeaders) {
      try {
        Object.assign(headers, JSON.parse(rawHeaders));
      } catch (e) {
        console.warn('Invalid headers JSON');
      }
    }

    // Add auth headers based on auth type
    switch (authType) {
      case 'API Key':
        headers['X-API-Key'] = apiKey;
        break;
      case 'Bearer Token':
        headers['Authorization'] = `Bearer ${bearerToken}`;
        break;
      case 'Basic Auth':
        const basicAuth = btoa(`${username}:${password}`);
        headers['Authorization'] = `Basic ${basicAuth}`;
        break;
    }

    // Make the request
    const response = await fetch(baseUrl, {
      method: connection.defaultMethod || 'GET',
      headers,
      timeout: connection.timeout || 30000
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  const fetchDatabaseData = async (connection: any) => {
    const { databaseType, host, port, database, username, password, query } = connection;
    
    // For demonstration, we'll use a mock API endpoint
    // In production, you should use proper database connectors
    const response = await fetch('/api/database/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: databaseType,
        host,
        port,
        database,
        username,
        password,
        query: query || 'SELECT * FROM users LIMIT 10' // Default query
      })
    });

    if (!response.ok) {
      throw new Error(`Database query failed: ${response.statusText}`);
    }

    return await response.json();
  };

  const fetchSftpData = async (connection: any) => {
    const { host, port, username, password, privateKey, rootPath, filePattern } = connection;
    
    // For demonstration, we'll use a mock API endpoint
    // In production, you should use proper SFTP client
    const response = await fetch('/api/sftp/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        host,
        port,
        username,
        password,
        privateKey,
        rootPath,
        filePattern
      })
    });

    if (!response.ok) {
      throw new Error(`SFTP operation failed: ${response.statusText}`);
    }

    return await response.json();
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 3 }}>
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Data Visualiser
        </Typography>

        {/* Connection Selection */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Connection Details
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              select
              label="Select Connection"
              value={selectedConnection}
              onChange={(e) => setSelectedConnection(e.target.value)}
              sx={{ minWidth: 300 }}
              helperText="Choose a connection to fetch data"
            >
              {connections.map((connection) => (
                <MenuItem key={connection.id} value={connection.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {connection.type === 'database' && <StorageIcon color="primary" />}
                    {connection.type === 'api' && <HttpIcon color="secondary" />}
                    {connection.type === 'sftp' && <FolderZipIcon color="success" />}
                    <Typography>{connection.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      ({connection.type})
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleFetchData}
              disabled={!selectedConnection || isLoading}
              sx={{ mt: 1 }}
            >
              {isLoading ? 'Fetching...' : 'Fetch Data'}
            </Button>
          </Box>
        </Paper>

        {/* Query Input for Database Connections */}
        {selectedConnection && 
         connections.find(c => c.id === selectedConnection)?.type === 'database' && (
          <TextField
            multiline
            rows={3}
            fullWidth
            label="SQL Query"
            placeholder="SELECT * FROM table_name LIMIT 10"
            sx={{ mt: 2 }}
            onChange={(e) => {
              const connection = connections.find(c => c.id === selectedConnection);
              if (connection) {
                connection.query = e.target.value;
              }
            }}
          />
        )}

        {/* Response Area */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Response
            </Typography>
            {selectedConnection && (
              <Typography variant="body2" color="textSecondary">
                Connected to: {connections.find(c => c.id === selectedConnection)?.name}
              </Typography>
            )}
          </Box>
          <Divider sx={{ mb: 3 }} />

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {response && !isLoading && (
            <Box 
              component="pre"
              sx={{ 
                p: 3,
                bgcolor: 'grey.50',
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: '500px',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}
            >
              {JSON.stringify(response, null, 2)}
            </Box>
          )}

          {!response && !isLoading && !error && (
            <Box sx={{ 
              p: 4, 
              textAlign: 'center', 
              color: 'text.secondary',
              bgcolor: 'grey.50',
              borderRadius: 1
            }}>
              <Typography>
                Select a connection and click "Fetch Data" to see the response
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};