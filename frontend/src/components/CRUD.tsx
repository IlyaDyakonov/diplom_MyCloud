import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import Login from "./Login";
import UseReg from "./UseReg";


/**
 * Компонент для отображения навигационного меню.
 * Использует текущее местоположение для определения активной ссылки.
 */
function Menu() {
    const location = useLocation();
    const isActive = 'crud-menu__item';
    const isNoActive = 'crud-menu__item';

    /**
     * Проверяет, является ли путь активным.
     * @param {string} path Путь для проверки.
     * @returns {boolean} Возвращает true, если путь активен.
     */
    const isExactActive = (path: string) => location.pathname === path;
    // Определяем текущий путь
    const currentPath = location.pathname;

    // Проверка, если мы находимся на странице логина или регистрации
    const isLoginOrRegisterPage = currentPath === "/api/login" || currentPath === "/api/register";
    // Рендеринг навигационного меню только если не находимся на страницах логина или регистрации
    if (isLoginOrRegisterPage) {
        return null; // Меню не будет отображаться
    }
    // Рендеринг навигационного меню
    return (
        <nav className="crud-menu">
            <NavLink to="/api/login" className={isExactActive('/api/login') ? isActive : isNoActive}>Вход</NavLink>
            <NavLink to="/api/register" className={isExactActive('/api/register') ? isActive : isNoActive}>Регистрация</NavLink>
        </nav>
    )
}


/**
 * главный компомент с навигацией по сайту
 */
function CRUD() {
    return (
        <div className="container navigation-menu">
            <Menu />
            <div className="page-crud">
                <Routes>
                    <Route path="/api/login" element={<Login />} />
                    <Route path="/api/register" element={<UseReg />} />
                </Routes>
            </div>
        </div>
    );
}

export default CRUD;