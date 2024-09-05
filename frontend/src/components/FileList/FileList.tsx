import { useEffect, useState } from 'react';
import File from './File/File';
import { FileElement, FileListProps } from '../../models';


const FileList: React.FC<FileListProps> = ({
    fileList,
    currentFile,
    setCurrentFile,
}) => {
    const [users, setUsers] = useState<string[]>([]);

    useEffect(() => {
        const userList: string[] = [];

        fileList.forEach((element: FileElement) => {
            userList.push(element.user);
        })

        const set = new Set(userList);
        const uniqUserList = Array.from(set);

        setUsers(uniqUserList);
    }, [fileList]);


    return (
        users && users.length > 1 ? (
            users.map((user) => (
                <div key={user}>
                    <h3 className="file-list-title">{user}</h3>
                    <div className="file-list-container">
                        {fileList.map(
                            (file: FileElement) => file.user === user
                                ? (
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
                                    />
                                )
                                : null
                        )}
                    </div>
                </div>
            ))
            ) : (
                <div className="file-list-container">
                    {fileList.map((file: FileElement) => (
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
                        />
                    ))}
                </div>
            )
    );
}

export default FileList;