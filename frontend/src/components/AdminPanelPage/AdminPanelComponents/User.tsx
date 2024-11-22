import { useEffect, useState } from "react";
import { deleteUser, patchUser } from "../../../api/api";
import IsStaffBtn from "./IsStaffBtn";
import ToFolderBtn from "./ToFolderBtn";
import { UserTypeAdminPanel } from "../../../models";


const User: React.FC<UserTypeAdminPanel> = ({
    id, username, email, numOfFiles, size, isStaff, removeItem,
}) => {
    const prefix = import.meta.env.BUILD_PREFIX || '';
    const [ sendRequest, setSendRequest ] = useState<"DELETE" | "PATCH" | "">("");
    const [_isStaff, _setIsStaff] = useState(isStaff);

    useEffect(() => {
        const fetchDataDelete = async () => {
            const response = await deleteUser(id);

            if (response.status === 200) {
                removeItem(id);
            }
        };

        const fetchDataPatch = async () => {
            await patchUser(id, _isStaff);
        };

        if (sendRequest === 'DELETE') {
            fetchDataDelete();
            setSendRequest('');
        }

        if (sendRequest === 'PATCH') {
            fetchDataPatch();
            setSendRequest('');
        }
    }, [sendRequest]);

    const onClickHandler = (method) => {
        setSendRequest(method);
    };

    return (
    <tr key={id}>
        <td>{ username }</td>
        {/* <td>{ first_name }</td>
        <td>{ last_name }</td> */}
        <td>{ email }</td>
        <td>{ numOfFiles }</td>
        <td>{ size }</td>
        <td>
            <IsStaffBtn isStaff={_isStaff} setIsStaff={_setIsStaff} onClickHandler={onClickHandler} />
        </td>
        <td>
            <ToFolderBtn userId={id} />
        </td>
        <td>
            <button onClick={() => onClickHandler('DELETE')} onKeyDown={() => onClickHandler('DELETE')} type="button" aria-label="Delete">
                <img src={`${prefix}del-icon.png`} alt="delete" />
            </button>
        </td>
    </tr>
    )
}

export default User;