import { useEffect, useState } from "react";
import { getUserList } from "../../../api/api";
import User from "./User";
import { UserTypeAdminPanel } from "../../../models";


function UsersList() {
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
        if (!renderedData) return;
        const newRenderedData = renderedData.filter((item) => item.id !== id);
        setRenderedData(newRenderedData);
    };

    return (
        <table>
            <thead>
                <tr>
                    <td>Username</td>
                    <td>Email</td>
                    <th>Number of files</th>
                    <th>Total file size (mb)</th>
                    <td>Is admin</td>
                    <td>To folder user</td>
                    <td>del user</td>
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
                            email={user.email}
                            numOfFiles={user.count}
                            size={Number((user.size * 9.537 * 10 ** -7).toFixed(2))}
                            isStaff={user.is_staff}
                            removeItem={removeItem}
                        />
                    ))
                    : null
                }
            </tbody>
        </table>
    )
}

export default UsersList;
