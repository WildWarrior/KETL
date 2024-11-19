import React from 'react';
import { Box, Typography, Paper, Collapse } from '@mui/material';

interface DebugInfoProps {
  columnDefs: any[];
  response: any;
  parsedData: any;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({ columnDefs, response, parsedData }) => {
  return (
    <Paper sx={{ p: 2, mt: 2, bgcolor: '#f5f5f5' }}>
      <Typography variant="subtitle2" color="primary" gutterBottom>
        Debug Information
      </Typography>
      <Box component="pre" sx={{ fontSize: '0.8rem', overflow: 'auto', maxHeight: '200px' }}>
        {JSON.stringify({
          columnDefinitions: columnDefs,
          sampleResponse: response,
          parsedRows: parsedData?.rows
        }, null, 2)}
      </Box>
    </Paper>
  );
}; 