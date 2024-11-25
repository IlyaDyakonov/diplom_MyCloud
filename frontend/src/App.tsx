import './App.css';
import CRUD from './components/CRUD';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';


function App() {
  return (
      <Router>
        <Header />
        <div className="body">
          <div className='backgraund-img'/>
            <Routes>
              <Route path="/*" element={<CRUD />} />
            </Routes>
        </div>
        <Footer />
      </Router>
  );
}

export default App;
