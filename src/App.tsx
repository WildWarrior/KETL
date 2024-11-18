import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { SchemaMapping } from './features/schemaMapping';
import { SchemaProvider } from './context/SchemaContext';
import { Connections } from './pages/Connections';
import { ConnectionProvider } from './context/ConnectionContext';
import { DataVisualiser } from './pages/DataVisualiser';
import { Header } from './components/layout/Header';
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
    <ConnectionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.100' }}>
              <SchemaProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Connections />} />
                    <Route path="/connections" element={<Connections />} />
                    <Route path="/mapper" element={<SchemaMapping />} />
                    <Route path="/visualiser" element={<DataVisualiser />} />
                  </Routes>
                </Layout>
              </SchemaProvider>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </ConnectionProvider>
  );
};

export default App;