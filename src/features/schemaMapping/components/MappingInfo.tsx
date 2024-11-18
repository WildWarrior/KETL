import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

interface Mapping {
  sourceId: string;
  targetId: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
}

interface MappingInfoProps {
  mappings: Mapping[];
  sourceSchema: any;
  targetSchema: any;
  onDeleteMapping: (index: number) => void;
}

export const MappingInfo: React.FC<MappingInfoProps> = ({
  mappings,
  sourceSchema,
  targetSchema,
  onDeleteMapping
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const getColumnName = (schemaType: 'source' | 'target', columnId: string) => {
    const schema = schemaType === 'source' ? sourceSchema : targetSchema;
    const column = schema?.columns.find((col: any) => col.id === columnId);
    return column ? column.name : 'Unknown';
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        right: isOpen ? 0 : -340,
        top: 80,
        transition: 'right 0.3s ease-in-out',
        zIndex: 1000,
        display: 'flex',
      }}
    >
      {/* Toggle Button */}
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          height: 48,
          width: 24,
          backgroundColor: 'primary.main',
          borderRadius: '4px 0 0 4px',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
      >
        {isOpen ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
      </IconButton>

      {/* Info Panel */}
      <Paper
        elevation={3}
        sx={{
          width: 340,
          maxHeight: 'calc(100vh - 100px)',
          overflow: 'auto',
          borderRadius: '4px 0 0 4px',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6">Field Mappings</Typography>
        </Box>

        <List sx={{ py: 0 }}>
          {mappings.map((mapping, index) => (
            <ListItem
              key={index}
              sx={{
                py: 1.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">
                      {getColumnName('source', mapping.sourceId)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      →
                    </Typography>
                    <Typography variant="body2">
                      {getColumnName('target', mapping.targetId)}
                    </Typography>
                  </Box>
                }
              />
              <IconButton
                size="small"
                onClick={() => onDeleteMapping(index)}
                sx={{ ml: 1 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItem>
          ))}
          {mappings.length === 0 && (
            <ListItem>
              <ListItemText
                secondary="No mappings created yet"
                sx={{ textAlign: 'center', color: 'text.secondary' }}
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
}; 