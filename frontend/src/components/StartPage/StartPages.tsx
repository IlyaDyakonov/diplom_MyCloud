import { NavLink } from "react-router-dom";
import './StartPages.css';
import { RootState } from "../../store";
import { useSelector } from "react-redux";


/**
 * Компонент для отображения главной страницы сайта.
 * Использует текущее местоположение для определения активной ссылки.
 */
export function StartPages() {
    // Получаем данные о состоянии пользователя из Redux store
    const loginUser = useSelector((state: RootState) => state.users.loginUser); // loginUser.name: apuox
    const activeState = useSelector((state: RootState) => state.users.activeState); // activeState: auth


    // Рендеринг навигационного меню
    return (
        <nav className="crud-menu">
            {activeState === 'auth' && loginUser ? (
                <div className="auth-name">
                    <h1>Добро пожаловать в наш сервис, уважаемый {loginUser.username}!</h1>
                    <h1>Перейти в фаловое хранилище!<NavLink to="/folder" className={'crud-menu__item'}>Clik!</NavLink></h1>
                </div>
            ) : (
                <div className="menu-login">
                    <h2 className="menu-login-welcome">Добро пожаловать на наш сервис облачного хранения данных!</h2>
                    <p className="menu-login-log-reg">Перед началом работы,
                        <NavLink to="/login" className={'crud-menu__item'}>войдите</NavLink>
                        или
                        <NavLink to="/register" className={'crud-menu__item'}>зарегистрируйтесь</NavLink>
                    </p>
                </div>
            )}
        </nav>
    )
}


    // const location = useLocation();
    // const isActive = 'crud-menu__item';
    // const isNoActive = 'crud-menu__item';
    // /**
    //  * Проверяет, является ли путь активным.
    //  * @param {string} path Путь для проверки.
    //  * @returns {boolean} Возвращает true, если путь активен.
    //  */
    // const isExactActive = (path: string) => location.pathname === path;
    // // Определяем текущий путь
    // const currentPath = location.pathname;

    // // Проверка, если мы находимся на странице логина или регистрации
    // const isLoginOrRegisterPage = currentPath === "/login" || currentPath === "/register";
    // // Рендеринг навигационного меню только если не находимся на страницах логина или регистрации
    // if (isLoginOrRegisterPage) {
    //     return null; // Меню не будет отображаться
    // }