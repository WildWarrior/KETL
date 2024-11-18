import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  IconButton as MuiIconButton,  // Import as MuiIconButton
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import { Schema } from '../../types/schema';

// Rename IconButton to avoid conflicts
const IconButton = MuiIconButton;

interface SchemaTableProps {
  schema: Schema;
  side: 'source' | 'destination';
  setRef: (id: string, ref: HTMLElement | null) => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
}

export const SchemaTable: React.FC<SchemaTableProps> = ({
  schema,
  side,
  setRef,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  return (
    <Paper sx={{ 
      width: '300px', 
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1,
      overflow: 'hidden'
    }}>
      {/* Main Header */}
      <Box sx={{ 
        p: 1, 
        display: 'flex', 
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default'
      }}>
        <Typography variant="subtitle2" sx={{ flex: 1 }}>
          {side === 'source' ? '☰ Source' : '↓ Target'}
        </Typography>
        <IconButton size="small">
          <SearchIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Schema Name Header */}
      <Box sx={{
        p: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}>
        <Typography variant="subtitle2" sx={{ 
          fontWeight: 'medium',
          color: 'text.primary'
        }}>
          {schema.name}
        </Typography>
      </Box>

      {/* Columns List */}
      <Box sx={{ maxHeight: '500px', overflow: 'auto' }}>
        {schema.columns.map((column) => (
          <Box
            key={column.id}
            ref={(ref) => setRef(column.id, ref)}
            draggable={side === 'source'}
            onDragStart={(e) => onDragStart?.(e, column.id)}
            onDragOver={(e) => {
              e.preventDefault();
              onDragOver?.(e);
            }}
            onDrop={(e) => {
              e.preventDefault();
              onDrop?.(e, column.id);
            }}
            sx={{
              p: 1.5,
              display: 'flex',
              flexDirection: 'column',
              cursor: side === 'source' ? 'grab' : 'default',
              '&:hover': { bgcolor: 'action.hover' },
              borderBottom: '1px solid',
              borderColor: 'divider',
              pl: 2,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 3,
                bgcolor: 'primary.main'
              }
            }}
          >
            <Typography variant="body2">{column.name}</Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                textTransform: 'uppercase',
                fontSize: '0.7rem',
                letterSpacing: 0.5
              }}
            >
              {column.type}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}; 