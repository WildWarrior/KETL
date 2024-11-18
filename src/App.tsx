import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { SchemaMapping } from './features/schemaMapping';
import { SchemaProvider } from './context/SchemaContext';

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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <SchemaProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mapper" element={<SchemaMapping />} />
              </Routes>
            </Layout>
          </SchemaProvider>
        </Router>
      </ThemeProvider>
  );
};

export default App;