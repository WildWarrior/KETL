import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  IconButton,
  Box,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSchemas } from '../context/SchemaContext';

const DATA_TYPES = ['INTEGER', 'VARCHAR', 'CHAR', 'DOUBLE'];

interface SchemaDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  type: 'source' | 'destination' | null;
}

export const SchemaDialog: React.FC<SchemaDialogProps> = ({ 
  open, 
  onClose, 
  onSave, 
  type
}) => {
  const { getSchemaByType } = useSchemas();
  
  // Initialize with empty or existing schema
  useEffect(() => {
    if (open && type) {
      const existingSchema = getSchemaByType(type);
      if (existingSchema) {
        setFormData({
          name: existingSchema.name,
          columns: existingSchema.columns.map(col => ({
            id: col.id,
            name: col.name,
            type: col.type
          }))
        });
      } else {
        setFormData({
          name: '',
          columns: [{ id: Date.now().toString(), name: '', type: '' }]
        });
      }
    }
  }, [open, type]);

  const [formData, setFormData] = useState({
    name: '',
    columns: [{ id: Date.now().toString(), name: '', type: '' }]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      schemaType: type
    });
    onClose();
  };

  const addColumn = () => {
    setFormData(prev => ({
      ...prev,
      columns: [...prev.columns, { name: '', type: '' }]
    }));
  };

  const removeColumn = (index: number) => {
    setFormData(prev => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target;
    
    if (typeof index === 'number') {
      setFormData(prev => ({
        ...prev,
        columns: prev.columns.map((col, i) => 
          i === index ? { ...col, [name]: value } : col
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      disablePortal
      disableEnforceFocus
      disableAutoFocus
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {type === 'source' ? 'Add Source Schema' : 'Add Target Schema'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Schema Name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          
          {formData.columns.map((column, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <TextField
                name="name"
                label="Column Name"
                value={column.name}
                onChange={(e) => handleChange(e, index)}
                size="small"
                required
                autoComplete="off"
                sx={{ flex: 1 }}
              />
              <TextField
                select
                name="type"
                label="Data Type"
                value={column.type}
                onChange={(e) => handleChange(e, index)}
                size="small"
                required
                sx={{ width: '150px' }}
              >
                {DATA_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
              {formData.columns.length > 1 && (
                <IconButton 
                  onClick={() => removeColumn(index)}
                  size="small"
                  color="error"
                  tabIndex={-1}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
          
          <Button
            startIcon={<AddIcon />}
            onClick={addColumn}
            variant="outlined"
            size="small"
            sx={{ mt: 2 }}
            tabIndex={-1}
          >
            Add Column
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};