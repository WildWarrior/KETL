import React from 'react';
import { 
  Paper, 
  Box,
  IconButton,
  Typography,
  Collapse,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import { Schema } from '../types/schema';

interface SchemaTableProps {
  schema: Schema;
  side: 'source' | 'destination';
  setRef?: (id: string, ref: HTMLElement) => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
}

export const SchemaTable: React.FC<SchemaTableProps> = React.memo(({ 
  schema, 
  side, 
  setRef,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const [expanded, setExpanded] = React.useState(true);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    if (side === 'source' && onDragStart) {
      onDragStart(e, columnId);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (side === 'destination' && onDragOver) {
      e.preventDefault();
      onDragOver(e);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    if (side === 'destination' && onDrop) {
      onDrop(e, columnId);
    }
  };

  return (
    <Paper sx={{ 
      width: '300px', 
      boxShadow: 2,
      position: 'relative',
      zIndex: 1
    }}>
      <Box sx={{ 
        p: 1, 
        display: 'flex', 
        alignItems: 'center', 
        borderBottom: '1px solid #e0e0e0',
        bgcolor: '#f5f5f5'
      }}>
        <Typography sx={{ flex: 1, fontWeight: 'bold' }}>
          {side === 'source' ? '☐ Source' : '↳ Target'}
        </Typography>
        <IconButton size="small">
          <SearchIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 1, borderBottom: '1px solid #e0e0e0' }}>
        <input
          type="text"
          placeholder={side === 'source' ? "Source" : "Target"}
          style={{
            width: '100%',
            padding: '4px 8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </Box>

      <Box>
        <Box 
          onClick={() => setExpanded(!expanded)}
          sx={{ 
            p: 1, 
            display: 'flex', 
            alignItems: 'center',
            bgcolor: '#f5f5f5',
            cursor: 'pointer',
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          <Typography sx={{ ml: 1 }}>
            {schema.name}
          </Typography>
        </Box>

        <Collapse in={expanded}>
          <List dense disablePadding>
            {schema.columns.map((column) => (
              <ListItem
                key={column.id}
                id={column.id}
                ref={setRef ? (el) => setRef(column.id, el as HTMLElement) : null}
                draggable={side === 'source'}
                onDragStart={(e) => handleDragStart(e, column.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
                sx={{
                  cursor: side === 'source' ? 'grab' : 'default',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  },
                  '&:active': {
                    cursor: side === 'source' ? 'grabbing' : 'default'
                  },
                  borderBottom: '1px solid #f0f0f0',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <ListItemText 
                  primary={column.name}
                  secondary={column.dataType}
                  primaryTypographyProps={{
                    style: { fontSize: '0.9rem' }
                  }}
                  secondaryTypographyProps={{
                    style: { fontSize: '0.8rem' }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Box>
    </Paper>
  );
});