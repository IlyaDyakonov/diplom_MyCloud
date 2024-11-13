import { useEffect, useState } from 'react';
import File from './File/File';
import { FileElement, FileListProps } from '../../../models';
import './FileList.css';


const FileList: React.FC<FileListProps> = ({
    fileList = [],  // Добавлено значение по умолчанию
    currentFile,
    setCurrentFile,
    currentUser
}) => {
    const [users, setUsers] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);  // Флаг для отслеживания загрузки данных

    useEffect(() => {
        // console.log("fileList:", fileList);
        // if (fileList && fileList.length > 0) {
        if (Array.isArray(fileList) && fileList.length > 0) {  // Проверка, что fileList — массив
            const userList: string[] = fileList.map((element: FileElement) => element.user);
            const uniqUserList = Array.from(new Set(userList));
            setUsers(uniqUserList);
            setIsLoaded(true);
        } else {
            setIsLoaded(false);  // Устанавливаем, что данных нет
        }
    }, [fileList]);

    const safeFileList = Array.isArray(fileList) ? fileList : [];

    if (!isLoaded) {
    // if (!Array.isArray(fileList) || fileList.length === 0) {  // Дополнительная проверка
        return <div>No files available! =(</div>;
    }

    return (
        users && users.length > 1 ? (
            users.map((user) => (
                <div key={user}>
                    <h3 className="file-list-title">{user}</h3>
                    <div className="file-list-container">
                        {safeFileList.map((file: FileElement) => (
                            file.user === user ? (
                                <File
                                    key={file.id}
                                    id={file.id}
                                    user={file.user}
                                    file_name={file.file_name}
                                    comment={file.comment}
                                    size={file.size}
                                    upload_date={file.upload_date}
                                    last_download_date={file.last_download_date}
                                    currentFile={currentFile}
                                    setCurrentFile={setCurrentFile}
                                    isOtherUserFile={file.user_id !== currentUser}
                                />
                            ) : null
                        ))}
                    </div>
                </div>
            ))
        ) : (
            <div className="file-list-container">
                {safeFileList.map((file) => (
                    <File
                        key={file.id}
                        id={file.id}
                        user={file.user}
                        file_name={file.file_name}
                        comment={file.comment}
                        size={file.size}
                        upload_date={file.upload_date}
                        last_download_date={file.last_download_date}
                        currentFile={currentFile}
                        setCurrentFile={setCurrentFile}
                        isOtherUserFile={file.user_id !== currentUser} // Pass prop to indicate if file belongs to another user
                    />
                ))}
            </div>
        )
    );
}

export default FileList;