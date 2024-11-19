import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface JsonPathHelperProps {
  response: any;
}

export const JsonPathHelper: React.FC<JsonPathHelperProps> = ({ response }) => {
  const generatePathExample = (obj: any, path: string = ''): string[] => {
    const paths: string[] = [];
    
    Object.keys(obj).forEach(key => {
      const currentPath = path ? `${path}.${key}` : `{"${key}"}`;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        paths.push(...generatePathExample(obj[key], currentPath));
      } else {
        paths.push(`${currentPath} = ${typeof obj[key]}`);
      }
    });
    
    return paths;
  };

  return (
    <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
      <Typography variant="subtitle2" gutterBottom>
        Available Paths:
      </Typography>
      <Box component="pre" sx={{ fontSize: '0.8rem', overflow: 'auto' }}>
        {generatePathExample(response).map((path, index) => (
          <div key={index}>{path}</div>
        ))}
      </Box>
    </Paper>
  );
}; 