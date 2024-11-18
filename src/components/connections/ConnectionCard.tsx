import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Paper,
  Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StorageIcon from '@mui/icons-material/Storage';
import HttpIcon from '@mui/icons-material/Http';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface ConnectionCardProps {
  connection: any;
  onEdit: (connection: any) => void;
  onDelete: (id: string) => void;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  onEdit,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'database':
        return <StorageIcon sx={{ fontSize: 40, color: 'primary.main' }} />;
      case 'api':
        return <HttpIcon sx={{ fontSize: 40, color: 'secondary.main' }} />;
      case 'sftp':
        return <FolderZipIcon sx={{ fontSize: 40, color: 'success.main' }} />;
      default:
        return <LinkIcon sx={{ fontSize: 40 }} />;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'error';
  };

  return (
    <Paper
      elevation={isHovered ? 4 : 1}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            p: 2,
            background: (theme) =>
              `linear-gradient(45deg, ${theme.palette.primary.main}22, ${theme.palette.primary.main}11)`,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {getConnectionIcon(connection.type)}
          <Box>
            <Typography variant="h6" component="div">
              {connection.name}
            </Typography>
            <Chip
              size="small"
              label={connection.status || 'active'}
              color={getStatusColor(connection.status || 'active')}
              icon={
                connection.status === 'active' ? (
                  <CheckCircleIcon />
                ) : (
                  <ErrorIcon />
                )
              }
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography color="textSecondary" variant="body2">
              Type: {connection.type.toUpperCase()}
            </Typography>
            {connection.type === 'database' && (
              <>
                <Typography variant="body2">
                  Database: {connection.databaseType}
                </Typography>
                <Typography variant="body2">Host: {connection.host}</Typography>
              </>
            )}
            {connection.type === 'api' && (
              <Typography variant="body2" noWrap>
                URL: {connection.baseUrl}
              </Typography>
            )}
            {connection.type === 'sftp' && (
              <Typography variant="body2">
                Host: {connection.host}:{connection.port}
              </Typography>
            )}
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Button
            size="small"
            startIcon={<LinkIcon />}
            onClick={() => {/* Add test connection handler */}}
          >
            Test Connection
          </Button>
          <Box>
            <Tooltip title="Edit Connection">
              <IconButton size="small" onClick={() => onEdit(connection)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Connection">
              <IconButton
                size="small"
                onClick={() => onDelete(connection.id)}
                sx={{ ml: 1 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
      </Card>
    </Paper>
  );
}; 