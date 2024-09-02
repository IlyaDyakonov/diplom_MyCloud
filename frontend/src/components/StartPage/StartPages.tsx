import { NavLink, useLocation } from "react-router-dom";
import './StartPages.css';
import { useSelector } from "react-redux";
import { RootState } from "../../store";



/**
 * Компонент для отображения главной страницы сайта.
 * Использует текущее местоположение для определения активной ссылки.
 */
export function StartPages() {
    const location = useLocation();
    const isActive = 'crud-menu__item';
    const isNoActive = 'crud-menu__item';

    // Получаем данные о состоянии пользователя из Redux store
    const loginUser = useSelector((state: RootState) => state.users.loginUser);
    const activeState = useSelector((state: RootState) => state.users.activeState);

    /**
     * Проверяет, является ли путь активным.
     * @param {string} path Путь для проверки.
     * @returns {boolean} Возвращает true, если путь активен.
     */
    const isExactActive = (path: string) => location.pathname === path;
    // Определяем текущий путь
    const currentPath = location.pathname;

    // Проверка, если мы находимся на странице логина или регистрации
    const isLoginOrRegisterPage = currentPath === "/login" || currentPath === "/register";
    // Рендеринг навигационного меню только если не находимся на страницах логина или регистрации
    if (isLoginOrRegisterPage) {
        return null; // Меню не будет отображаться
    }
    // Рендеринг навигационного меню
    return (
        <nav className="crud-menu">
            {activeState === 'auth' && loginUser ? (
                <div className="login-name">
                    Вы вошли как {loginUser.username}
                </div>
            ) : (
            // <>
                <div className="menu-login">
                    <h2 className="menu-login-welcome">Добро пожаловать на наш сервис облачного хранения данных!</h2>
                    <p className="menu-login-log-reg">Перед началом работы,
                        <NavLink to="/login" className={isExactActive('/login') ? isActive : isNoActive}>войдите</NavLink>
                        или
                        <NavLink to="/register" className={isExactActive('/register') ? isActive : isNoActive}>зарегистрируйтесь</NavLink>
                    </p>
                </div>
            // </>
            )}
        </nav>
    )
}