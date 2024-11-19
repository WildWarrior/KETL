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
} from '@mui/material';
import Editor from '@monaco-editor/react';
import { DataGrid } from '@mui/x-data-grid';
import { useConnections } from '../context/ConnectionContext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HttpIcon from '@mui/icons-material/Http';
import StorageIcon from '@mui/icons-material/Storage';
import FolderIcon from '@mui/icons-material/Folder';
import { JsonStructureHelper } from '../components/JsonStructureHelper';
/* import { DebugInfo } from '../components/DebugInfo'; */

export const DataVisualiser = () => {
  const { connections } = useConnections();
  const [selectedConnection, setSelectedConnection] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [editorContent, setEditorContent] = useState(`// JSON Flattener - Column Definition Guide

  // 1. Get specific node names using InnerNode notation:
  //Column First = NodeName.{"Global Quote"}.InnerNode1   // Gets "01. symbol"
  //Column Second = NodeName.{"Global Quote"}.InnerNode2  // Gets "02. open"
  //Column Third = NodeName.{"Global Quote"}.InnerNode3   // Gets "03. high"

  // 2. Get all node names in one column (creates multiple rows):
  //Column AllNodes = NodeName.{"Global Quote"}.*

  // 3. Get node name and its value:
  //Column SymbolInfo = NodeName.{"Global Quote"}.InnerNode1 + ": " + {"Global Quote"}.{"01. symbol"}
  //Column OpenInfo = NodeName.{"Global Quote"}.InnerNode2 + ": " + {"Global Quote"}.{"02. open"}

  // 4. Get all nodes and their values (creates multiple rows):
  //Column Properties = NodeName.{"Global Quote"}.* 
  //Column Values = {"Global Quote"}.*

  // Example for your current data:
  //Column Symbol = {"Global Quote"}.{"01. symbol"}
  //Column Open = {"Global Quote"}.{"02. open"}
  //Column High = {"Global Quote"}.{"03. high"}
  //Column Low = {"Global Quote"}.{"04. low"}
  //Column Price = {"Global Quote"}.{"05. price"}
  `);

  const getValueFromPath = (obj: any, path: string): any[] => {
    try {
      const isNodeNameExtraction = path.startsWith('NodeName.');
      const actualPath = isNodeNameExtraction ? path.replace('NodeName.', '') : path;
      
      // Handle wildcard for node names
      if (actualPath.endsWith('.*')) {
        const basePath = actualPath.slice(0, -2); // Remove .*
        const baseObj = navigateToPath(obj, basePath);
        if (baseObj && typeof baseObj === 'object') {
          // Return each key as a separate value for multiple rows
          return Object.keys(baseObj);
        }
        return [null];
      }

      const parts = parsePath(actualPath);
      return extractValues(obj, parts, [], isNodeNameExtraction);
    } catch (error) {
      console.error('Path parsing error:', error);
      return [null];
    }
  };

  const navigateToPath = (obj: any, path: string): any => {
    const parts = parsePath(path);
    let current = obj;
    
    for (const part of parts) {
      if (!current) return null;
      
      if (part.startsWith('node:')) {
        current = current[part.split(':')[1]];
      }
    }
    
    return current;
  };

  const parsePath = (path: string): string[] => {
    const parts: string[] = [];
    const regex = /(?:{"([^}]+)"})|\[(\d+)\]|(\$key)|(\*)|(\w+)/g;
    let match;

    while ((match = regex.exec(path)) !== null) {
      if (match[1]) parts.push('node:' + match[1]);
      else if (match[2]) parts.push('index:' + match[2]);
      else if (match[3]) parts.push('key');
      else if (match[4]) parts.push('*');
      else if (match[5]) parts.push('innerNode:' + match[5]);
    }

    return parts;
  };

  const extractValues = (
    obj: any, 
    parts: string[], 
    currentPath: string[] = [], 
    isNodeNameExtraction: boolean = false
  ): any[] => {
    if (!obj || !parts.length) {
      if (isNodeNameExtraction && currentPath.length) {
        return [currentPath[currentPath.length - 1]];
      }
      return [obj];
    }
    
    const [currentPart, ...remainingParts] = parts;
    const values: any[] = [];

    if (currentPart === '*') {
      Object.entries(obj).forEach(([key, value]) => {
        if (isNodeNameExtraction && !remainingParts.length) {
          values.push(key);
        } else {
          values.push(...extractValues(value, remainingParts, [...currentPath, key], isNodeNameExtraction));
        }
      });
    } else if (currentPart.startsWith('innerNode:')) {
      const nodeNum = parseInt(currentPart.split(':')[1].replace('InnerNode', ''));
      const keys = Object.keys(obj);
      const index = nodeNum - 1; // Convert to 0-based index
      
      if (index >= 0 && index < keys.length) {
        if (isNodeNameExtraction && !remainingParts.length) {
          values.push(keys[index]);
        } else {
          values.push(...extractValues(
            obj[keys[index]], 
            remainingParts, 
            [...currentPath, keys[index]], 
            isNodeNameExtraction
          ));
        }
      }
    } else if (currentPart.startsWith('node:')) {
      const nodeName = currentPart.split(':')[1];
      if (obj.hasOwnProperty(nodeName)) {
        if (isNodeNameExtraction && !remainingParts.length) {
          values.push(nodeName);
        } else {
          values.push(...extractValues(
            obj[nodeName], 
            remainingParts, 
            [...currentPath, nodeName], 
            isNodeNameExtraction
          ));
        }
      }
    }

    return values.length ? values : [null];
  };

  const parseColumnDefinitions = (content: string) => {
    const lines = content.split('\n');
    const columnDefs: any[] = [];

    lines.forEach(line => {
      // Skip comments and empty lines
      if (line.trim().startsWith('//') || !line.trim()) return;

      // Updated regex to handle NodeName and spaces in node names
      const match = line.match(/Column\s+(\w+)\s*=\s*(NodeName\.)?((?:{"[^}]+"})(?:\.(?:{"[^}]+"}|\*|InnerNode\d+))*)/);
      
      if (match) {
        columnDefs.push({
          field: match[1],
          path: (match[2] || '') + match[3], // Include NodeName. if present
          isNodeName: !!match[2]
        });
      }
    });

    console.log('Parsed Column Definitions:', columnDefs);
    return columnDefs;
  };

  const processResponseData = (responseData: any, columnDefs: any[]) => {
    try {
      console.log('Processing response data:', responseData);
      
      // Get maximum number of rows needed
      let maxRows = 1;
      const expandedValues: { [key: string]: any[] } = {};
      
      // First pass: collect all values and determine max rows
      columnDefs.forEach(def => {
        const values = getValueFromPath(responseData, def.path);
        expandedValues[def.field] = Array.isArray(values) ? values : [values];
        maxRows = Math.max(maxRows, expandedValues[def.field].length);
      });

      // Create rows
      const rows: any[] = [];
      for (let i = 0; i < maxRows; i++) {
        const row: any = { id: i };
        
        // Fill each column
        columnDefs.forEach(def => {
          const values = expandedValues[def.field];
          row[def.field] = values[i] || values[0] || null; // Use first value if index doesn't exist
        });
        
        rows.push(row);
      }

      console.log('Generated rows:', rows);
      return rows;
    } catch (error) {
      console.error('Data processing error:', error);
      return [];
    }
  };

  const testPathParsing = () => {
    if (!response) return;
    
    console.log('=== Testing Path Parsing ===');
    
    const testPath = '{"Global Quote"}.{"01. symbol"}';
    console.log('\nTesting single path:', testPath);
    const value = getValueFromPath(response, testPath);
    console.log('Extracted value:', value);
    
    const columnDefs = parseColumnDefinitions(editorContent);
    console.log('\n=== Testing All Column Paths ===');
    columnDefs.forEach(def => {
      console.log(`\nTesting ${def.field}:`);
      console.log('Path:', def.path);
      const value = getValueFromPath(response, def.path);
      console.log('Value:', value);
    });
  };

  const handleFetchData = async () => {
    if (!selectedConnection) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const connection = connections.find(c => c.id === selectedConnection);
      if (!connection) throw new Error('Connection not found');

      // Validate column definitions before fetching
      const columnDefs = parseColumnDefinitions(editorContent);
      if (columnDefs.length === 0) {
        throw new Error('No valid column definitions found in the editor');
      }

      // Fetch data
      let fetchedData;
      switch (connection.type) {
        case 'api':
          fetchedData = await fetchApiData(connection);
          break;
        case 'database':
          fetchedData = await fetchDatabaseData(connection);
          break;
        case 'sftp':
          fetchedData = await fetchSftpData(connection);
          break;
        default:
          throw new Error('Unsupported connection type');
      }

      // Store response
      setResponse(fetchedData);

      // Process data immediately
      const columns = columnDefs.map(def => ({
        field: def.field,
        headerName: def.field,
        flex: 1,
        minWidth: 150,
      }));

      const rows = processResponseData(fetchedData, columnDefs);
      setParsedData({ columns, rows });

      console.log('Fetch and process complete:', {
        response: fetchedData,
        columns,
        rows
      });

    } catch (err: any) {
      console.error('Fetch Error:', err);
      setError(err.message || 'Failed to fetch data');
      setParsedData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApiData = async (connection: any) => {
    const { baseUrl, authType, apiKey, bearerToken, username, password, headers: rawHeaders } = connection;
    
    const headers: Record<string, string> = {};
    if (rawHeaders) {
      try {
        Object.assign(headers, JSON.parse(rawHeaders));
      } catch (e) {
        console.warn('Invalid headers JSON');
      }
    }

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

    const response = await fetch(baseUrl, {
      method: connection.defaultMethod || 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  const fetchDatabaseData = async (connection: any) => {
    // Implement database fetch logic
    const response = await fetch('/api/database/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(connection)
    });

    if (!response.ok) {
      throw new Error(`Database query failed: ${response.statusText}`);
    }

    return await response.json();
  };

  const fetchSftpData = async (connection: any) => {
    // Implement SFTP fetch logic
    const response = await fetch('/api/sftp/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(connection)
    });

    if (!response.ok) {
      throw new Error(`SFTP operation failed: ${response.statusText}`);
    }

    return await response.json();
  };

  // Add a helper function to show available node names
  const getNodeNames = (obj: any, prefix: string = ''): string[] => {
    const names: string[] = [];
    
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach((key, index) => {
        const currentPath = prefix ? `${prefix}.{"${key}"}` : `{"${key}"}`;
        names.push(`Column ${key.replace(/\W+/g, '')} = NodeName.${currentPath}`);
        
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          names.push(...getNodeNames(obj[key], currentPath));
        }
      });
    }
    
    return names;
  };

  // Add a helper function to show all available paths
  const generatePathSuggestions = (obj: any, path = ''): string[] => {
    const suggestions: string[] = [];
    
    if (typeof obj === 'object' && obj !== null) {
      // Add current level suggestions
      suggestions.push(`// Get all properties at this level:`);
      suggestions.push(`Column AllNodes = NodeName.${path}.*`);
      suggestions.push('');
      
      // Add individual property suggestions
      Object.keys(obj).forEach((key, index) => {
        const newPath = path ? `${path}.{"${key}"}` : `{"${key}"}`;
        suggestions.push(`// Property ${index + 1}:`);
        suggestions.push(`Column Name = NodeName.${newPath}`);
        suggestions.push(`Column Value = ${newPath}`);
        suggestions.push('');
        
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          suggestions.push(...generatePathSuggestions(obj[key], newPath));
        }
      });
    }
    
    return suggestions;
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 3 }}>
      <Box sx={{ py: 4 }}>
        {/* Connection Selection and Fetch */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              select
              label="Select Connection"
              value={selectedConnection}
              onChange={(e) => setSelectedConnection(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              {connections.map((connection) => (
                <MenuItem key={connection.id} value={connection.id}>
                  {connection.name}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleFetchData}
              disabled={!selectedConnection || isLoading}
            >
              {isLoading ? 'Fetching...' : 'Fetch & Process'}
            </Button>
          </Box>
        </Paper>

        {/* Column Definition Editor */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Column Definitions
          </Typography>
          <Editor
            height="200px"
            defaultLanguage="sql"
            value={editorContent}
            onChange={(value) => setEditorContent(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
            }}
          />
        </Paper>

        {/* Loading Indicator */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Data Grid */}
        {parsedData && parsedData.rows.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Data Table
            </Typography>
            <DataGrid
              rows={parsedData.rows}
              columns={parsedData.columns}
              autoHeight
              density="compact"
              disableRowSelectionOnClick
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              sx={{ 
                mt: 2,
                '& .MuiDataGrid-cell': {
                  fontSize: '0.9rem',
                }
              }}
            />
          </Paper>
        )}

        {/* Debug Information - Commented out for now
        {process.env.NODE_ENV === 'development' && response && (
          <Paper sx={{ p: 2, mt: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle2" gutterBottom>
              Debug Information
            </Typography>
            <Box component="pre" sx={{ fontSize: '0.8rem', overflow: 'auto' }}>
              {JSON.stringify({
                columnDefs: parseColumnDefinitions(editorContent),
                samplePath: response ? getValueFromPath(response, '{"Time Series (Daily)"}.InnerNode1') : null,
                parsedRows: parsedData?.rows
              }, null, 2)}
            </Box>
          </Paper>
        )}
        */}

      </Box>
    </Box>
  );
};