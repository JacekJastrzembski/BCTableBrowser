import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DataList from './pages/DataList';
import DataDetails from './pages/DataDetails'
import { Box } from '@mui/material';
import SideMenu from './components/SideMenu';

function App() {

  return (
    <>
      <Router>
        <Box sx={{ display: "flex" }}>
          <SideMenu />
          <Box sx={{ flexGrow: 2, p: 3 }}>
            <Routes>
              <Route path="/" element={<DataList />} />
              <Route path="/details/:tableName" element={<DataDetails />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </>
  )
}

export default App
