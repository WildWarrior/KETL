import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useConnections } from '../context/ConnectionContext';
import { ConnectionDialog } from '../components/connections/ConnectionDialog';
import { ConnectionCard } from '../components/connections/ConnectionCard';

export const Connections = () => {
  const { connections, addConnection, updateConnection, deleteConnection } = useConnections();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingConnection, setEditingConnection] = useState<any>(null);

  const handleSave = (values: any) => {
    if (editingConnection) {
      updateConnection(editingConnection.id, values);
    } else {
      addConnection(values);
    }
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingConnection(null);
  };

  const handleEdit = (connection: any) => {
    setEditingConnection(connection);
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    deleteConnection(id);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h5">Data Connections</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          New Connection
        </Button>
      </Box>

      <Grid container spacing={3}>
        {connections.map((connection) => (
          <Grid item xs={12} sm={6} md={4} key={connection.id}>
            <ConnectionCard
              connection={connection}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>

      <ConnectionDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
        initialData={editingConnection}
      />
    </Box>
  );
};