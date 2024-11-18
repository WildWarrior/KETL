import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SchemaDialog } from '../../components/SchemaDialog';
import { DataMapping } from '../../pages/DataMapping';
import { useSchemas } from '../../context/SchemaContext';

export const SchemaMapping = () => {
  const { openDialog, setOpenDialog, handleSaveSchema } = useSchemas();

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Schema Mapping</Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            onClick={() => setOpenDialog('source')} 
            size="small"
          >
            Add Source Schema
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setOpenDialog('destination')} 
            size="small"
          >
            Add Target Schema
          </Button>
        </Box>
      </Box>

      <DataMapping />

      <SchemaDialog
        open={!!openDialog}
        onClose={() => setOpenDialog(null)}
        onSave={handleSaveSchema}
        type={openDialog}
      />
    </Box>
  );
}; 