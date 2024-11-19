import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { SchemaMapping } from './features/schemaMapping/SchemaMapping';
import { SchemaProvider } from './context/SchemaContext';
import { Connections } from './pages/Connections';
import { ConnectionProvider } from './context/ConnectionContext';
import { DataVisualiser } from './pages/DataVisualiser';
import { DataMapping } from './pages/DataMapping';
import { Box } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#e3f2fd',
    },
    secondary: {
      main: '#fff',
    },
    background: {
      default: '#f5f7fa',
    },
  },
});

const App: React.FC = () => {
  return (
    <SchemaProvider>
      <ConnectionProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            
              <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.100' }}>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/connections" element={<Connections />} />
                    <Route path="/visualiser" element={<DataVisualiser />} />
                    <Route path="/mapper" element={<SchemaMapping />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </Box>
          </Router>
        </ThemeProvider>
      </ConnectionProvider>
    </SchemaProvider>
  );
};

export default App;