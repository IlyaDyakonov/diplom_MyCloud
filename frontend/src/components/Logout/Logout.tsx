import './Logout.css';
import { useNavigate } from "react-router-dom";
import { logOut } from "../../api/api";
import { AppDispatch, RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from '../../slices/usersSlice';


const Logout: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const loginUser = useSelector((state: RootState) => state.users.loginUser);

    const handleLogout = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
        if (loginUser) { // Проверка на null
            dispatch(logoutSuccess());
            logOut(loginUser.username);
            navigate('/');
        }
    }

    return (
        <div className="logout">
            <form className="logout-submit" onSubmit={handleLogout}>
                <button type="submit" className="form-out">Выйти</button>
            </form>
        </div>
    )

}

export default Logout;
