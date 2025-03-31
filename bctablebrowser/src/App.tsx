import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DataList from './pages/DataList';
import DataDetails from './pages/DataDetails'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<DataList />} />
          <Route path="/details/:tableName" element={<DataDetails />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
