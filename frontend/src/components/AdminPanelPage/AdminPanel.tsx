import './AdminPanel.css';
import UsersList from './AdminPanelComponents/UserList';
import { useFetchCheckUserStatus } from '../../slices/useFetchCheckUserStatus';


function AdminPanel() {
    const loginUser = useFetchCheckUserStatus();
    const isAdmin = loginUser?.is_superuser;

    if (!isAdmin) {
        return (
            <div className="admin-panel--access-denied">
                <span className="content">У вас нет прав на просмотр админ панели</span>
            </div>
        );
    }

    return <UsersList />;
}

export default AdminPanel;