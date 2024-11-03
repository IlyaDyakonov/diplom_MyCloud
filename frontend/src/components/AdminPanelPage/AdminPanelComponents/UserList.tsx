import { useEffect, useState } from "react";
import { getUserList } from "../../../api/api";
import User from "./User";
import { UserTypeAdminPanel } from "../../../models";


function UserList() {
    const [renderedData, setRenderedData] = useState<UserTypeAdminPanel[] | null>(null);;

    useEffect(() => {
        const fetchData = async () => {
            const response = await getUserList();
            const data = response;
            if (response !== null) {
                setRenderedData(data);
            }
        };

        fetchData();
    }, []);

    const removeItem = (id: number) => {
        const newRenderedData = renderedData.filter((item) => item.id !== id);
        setRenderedData(newRenderedData);
    };

    return (
        <table>
            <thead>
                <tr>
                    <td>Username</td>
                    <td>First name</td>
                    <td>Last name</td>
                    <td>Email</td>
                    <td>Folder name</td>
                    <td>Is admin</td>
                </tr>
            </thead>
            <tbody>
                {
                renderedData
                    ? renderedData.map((user) => (
                        <User
                            key={user.id}
                            id={user.id}
                            username={user.username}
                            first_name={user.first_name}
                            last_name={user.last_name}
                            email={user.email}
                            is_staff={user.is_staff}
                            removeItem={removeItem}
                        />
                    ))
                    : null
                }
            </tbody>
        </table>
    )
}

export default UserList;


