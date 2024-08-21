import './App.css';
import CRUD from './components/CRUD';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <Router>
      <h1>Облачное хранилище «MyCloud!»</h1>
      <header className='header'>
        <nav className="nav-components">
          {/* <NavLink to={"/api/login"} className="nav-link">Вход</NavLink>
          <NavLink to={"/api/register"} className="nav-link">Регистрация</NavLink> */}
          <Routes>
            <Route path="/*" element={<CRUD />} />
          </Routes>
        </nav>
      </header>


    </Router>
  )
}

export default App;
