import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

const steps = ['Basic Details', 'Authentication', 'Connection Details'];

const CONNECTION_TYPES = [
  { 
    value: 'database', 
    label: 'Database',
    authTypes: ['Basic Auth', 'SSL Certificate']
  },
  { 
    value: 'api', 
    label: 'API',
    authTypes: ['No Auth', 'API Key', 'Bearer Token', 'Basic Auth']
  },
  { 
    value: 'sftp', 
    label: 'SFTP',
    authTypes: ['Password', 'SSH Key']
  }
];

export const ConnectionDialog = ({ open, onClose, onSave, initialData }) => {
  const [activeStep, setActiveStep] = useState(0);

  const renderStepContent = (formikProps: any) => {
    const { values, errors, touched, handleChange, handleBlur } = formikProps;

    switch (activeStep) {
      case 0: // Basic Details
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Connection Name"
              fullWidth
              required
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />
            <TextField
              select
              name="type"
              label="Connection Type"
              fullWidth
              required
              value={values.type}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.type && Boolean(errors.type)}
              helperText={touched.type && errors.type}
            >
              {CONNECTION_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        );

      case 1: // Authentication
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              name="authType"
              label="Authentication Type"
              fullWidth
              required
              value={values.authType || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.authType && Boolean(errors.authType)}
              helperText={touched.authType && errors.authType}
            >
              {CONNECTION_TYPES.find(t => t.value === values.type)?.authTypes.map((authType) => (
                <MenuItem key={authType} value={authType}>
                  {authType}
                </MenuItem>
              ))}
            </TextField>
            
            {/* Auth Type specific fields */}
            {values.authType === 'Basic Auth' && (
              <>
                <TextField
                  name="username"
                  label="Username"
                  fullWidth
                  required
                  value={values.username || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                />
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  value={values.password || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </>
            )}
            
            {values.authType === 'API Key' && (
              <TextField
                name="apiKey"
                label="API Key"
                fullWidth
                required
                value={values.apiKey || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.apiKey && Boolean(errors.apiKey)}
                helperText={touched.apiKey && errors.apiKey}
              />
            )}
          </Box>
        );

      case 2: // Connection Details
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {values.type === 'database' && (
              <>
                <TextField
                  select
                  name="databaseType"
                  label="Database Type"
                  fullWidth
                  required
                  value={values.databaseType || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="mysql">MySQL</MenuItem>
                  <MenuItem value="postgresql">PostgreSQL</MenuItem>
                  <MenuItem value="mongodb">MongoDB</MenuItem>
                  <MenuItem value="oracle">Oracle</MenuItem>
                  <MenuItem value="sqlserver">SQL Server</MenuItem>
                </TextField>
                <TextField
                  name="host"
                  label="Host"
                  fullWidth
                  required
                  value={values.host || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <TextField
                  name="port"
                  label="Port"
                  type="number"
                  fullWidth
                  required
                  value={values.port || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <TextField
                  name="database"
                  label="Database Name"
                  fullWidth
                  required
                  value={values.database || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <TextField
                  name="schema"
                  label="Schema"
                  fullWidth
                  value={values.schema || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <TextField
                  name="connectionString"
                  label="Connection String (Optional)"
                  fullWidth
                  multiline
                  rows={2}
                  value={values.connectionString || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </>
            )}
            
            {values.type === 'api' && (
              <>
                <TextField
                  name="baseUrl"
                  label="Base URL"
                  fullWidth
                  required
                  value={values.baseUrl || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <TextField
                  select
                  name="defaultMethod"
                  label="Default Method"
                  fullWidth
                  required
                  value={values.defaultMethod || 'GET'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                  <MenuItem value="PATCH">PATCH</MenuItem>
                </TextField>
                <TextField
                  name="headers"
                  label="Default Headers (JSON)"
                  fullWidth
                  multiline
                  rows={3}
                  value={values.headers || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder='{"Content-Type": "application/json"}'
                />
                <TextField
                  name="timeout"
                  label="Timeout (ms)"
                  type="number"
                  fullWidth
                  value={values.timeout || 30000}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </>
            )}
            
            {values.type === 'sftp' && (
              <>
                <TextField
                  name="host"
                  label="Host"
                  fullWidth
                  required
                  value={values.host || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <TextField
                  name="port"
                  label="Port"
                  type="number"
                  fullWidth
                  required
                  value={values.port || '22'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <TextField
                  name="rootPath"
                  label="Root Path"
                  fullWidth
                  required
                  value={values.rootPath || '/'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <TextField
                  name="filePattern"
                  label="File Pattern"
                  fullWidth
                  value={values.filePattern || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="*.csv, *.json"
                />
                <TextField
                  name="remoteDirectory"
                  label="Remote Directory"
                  fullWidth
                  value={values.remoteDirectory || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Connection' : 'New Connection'}
      </DialogTitle>
      <Formik
        initialValues={{
          name: '',
          type: '',
          authType: '',
          username: '',
          password: '',
          apiKey: '',
          host: '',
          port: '',
          database: '',
          baseUrl: '',
          rootPath: '/',
          ...initialData
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Name is required'),
          type: Yup.string().required('Type is required'),
          // Add more validation as needed
        })}
        onSubmit={(values) => {
          onSave(values);
        }}
      >
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            <DialogContent>
              <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              {renderStepContent(formikProps)}
            </DialogContent>
            
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              {activeStep > 0 && (
                <Button onClick={() => setActiveStep((prev) => prev - 1)}>
                  Back
                </Button>
              )}
              {activeStep === steps.length - 1 ? (
                <Button type="submit" variant="contained">
                  Save
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => {
                    formikProps.validateForm().then((errors) => {
                      if (Object.keys(errors).length === 0) {
                        setActiveStep((prev) => prev + 1);
                      }
                    });
                  }}
                >
                  Next
                </Button>
              )}
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};