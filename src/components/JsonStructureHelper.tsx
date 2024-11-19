import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const JsonStructureHelper: React.FC<{ response: any }> = ({ response }) => {
  const generateSuggestions = (obj: any, path = ''): string[] => {
    const suggestions: string[] = [];
    
    if (typeof obj === 'object' && obj !== null) {
      if (Object.keys(obj).length > 0) {
        suggestions.push(`// Multiple rows - all properties at this level:`);
        suggestions.push(`Column Names = NodeName.${path}.*  // Will create ${Object.keys(obj).length} rows`);
        suggestions.push(`Column Values = ${path}.*  // Will create ${Object.keys(obj).length} rows`);
        suggestions.push('');
      }
      
      Object.entries(obj).forEach(([key, value], index) => {
        const newPath = path ? `${path}.{"${key}"}` : `{"${key}"}`;
        const valueType = typeof value;
        const isObject = valueType === 'object' && value !== null;
        
        suggestions.push(`// ${isObject ? 'Object' : 'Value'} Property ${index + 1}:`);
        suggestions.push(`Column ${key.replace(/\W+/g, '')} = ${newPath}  // ${isObject ? 'Contains nested data' : 'Single value'}`);
        
        if (isObject) {
          suggestions.push(...generateSuggestions(value, newPath).map(s => '  ' + s));
        }
        suggestions.push('');
      });
    }
    
    return suggestions;
  };

  return (
    <Paper sx={{ p: 2, mt: 2, bgcolor: '#f5f5f5' }}>
      <Typography variant="subtitle2" gutterBottom>
        Available Path Suggestions:
      </Typography>
      <Typography variant="caption" color="textSecondary" paragraph>
        Note: Paths with .* will create multiple rows in the result
      </Typography>
      <Box component="pre" sx={{ fontSize: '0.8rem', overflow: 'auto', maxHeight: '300px' }}>
        {generateSuggestions(response).join('\n')}
      </Box>
    </Paper>
  );
}; 