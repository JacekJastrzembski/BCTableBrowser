import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DataList from './pages/DataList';
import DataDetails from './pages/DataDetails'
import SideMenu from './components/SideMenu';
import { Box, CssBaseline, Divider, ThemeProvider } from '@mui/material';
import { useState } from 'react';
import { lightTheme, darkTheme } from './theme';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  return (
    <>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Router>
          <Divider sx={{ position: 'fixed', top: 0, height: '55px', width: '100vw', zIndex: 1100, }} />
          <Box
            sx={{
              display: 'flex',
              mt: '35px',
            }}
          >
            <Box sx={{ display: 'flex'}}>
              <SideMenu darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <Box className="page-container" sx={{ flexGrow: 2, p: 3 }}>
                <Routes>
                  <Route path="/" element={<Navigate to="/tables" replace />} />
                  <Route path="/tables" element={<DataList />} />
                  <Route path="/details/:tableName" element={<DataDetails />} />
                </Routes>
              </Box>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </>
  )
}

export default App
