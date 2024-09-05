import './App.css';
import CRUD from './components/CRUD';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';


function App() {
  return (
    <Router>
      <Header />
      <div className='body'>
          <Routes>
            <Route path="/*" element={<CRUD />} />
          </Routes>
      </div>
      <Footer />
    </Router>
  )
}

export default App;

ДЛЯ СЕБЯ:
логин и регистрация пользователей работает. отображение страниц работает.
настроить переход после логина пользователя на страницу с его файлами(страница с файлами готова осталось правильно подключить)
сделать админку пользователю