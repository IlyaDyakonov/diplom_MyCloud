import './App.css';
import CRUD from './components/CRUD';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';


function App() {
  return (
    <Router>
      <h1>Облачное хранилище «MyCloud!»</h1>
      <header className='header'>
        <nav className="nav-components">
          <Routes>
            <Route path="/*" element={<CRUD />} />
          </Routes>
        </nav>
      </header>
      <Footer />
    </Router>
  )
}

export default App;
