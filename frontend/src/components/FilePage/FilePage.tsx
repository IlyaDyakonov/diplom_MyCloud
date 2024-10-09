import FileList from '../FileStorage/FileList/FileList';
import { createFile, getAllFiles, getUserFiles } from '../../api/api';
import { createContext, useContext, useState, useEffect } from 'react';
// import state from './state';
import FileAdd from '../FileStorage/FileEdit/FileAdd';
import { RootState } from "../../store";
import { useSelector } from "react-redux";


const FileContext = createContext<{
    currentStorageUser: number;
    setCurrentStorageUser: (userId: number) => void;
}>({
    currentStorageUser: 0,
    setCurrentStorageUser: () => {},
});

function FilePage() {
    const [ currentFile, setCurrentFile ] = useState<File | null>(null);
    const [ files, setFiles ] = useState<any[]>([]);
    // const [ currentStorageUser, setCurrentStorageUser ] = useState<number>(0);
    const userId = useSelector((state: RootState) => state.users.loginUser.id);
    const [currentStorageUser, setCurrentStorageUser] = useState<number>(userId || 0); // Устанавливаем ID текущего пользователя

    useEffect(() => {
        if (userId) {
            setCurrentStorageUser(userId);
        }
        const fetchData = async () => {
            let response;

            if (!currentStorageUser) {
                console.log(`Запрос на получения списка файлов отправлен! 1: ${currentStorageUser}`)
                response = await getUserFiles(currentStorageUser);
                // response = await getAllFiles();
            // }
            } else {
                console.log(`Запрос на получения списка файлов отправлен! 2: ${currentStorageUser}`)
                response = await getAllFiles();
            }
            const data = response.data;
            console.log('Запрос:', data)
            setFiles(data);
        }
        fetchData();
    }, [currentStorageUser, userId])

    const loginUser = useSelector((state: RootState) => state.users.loginUser); // loginUser.name: apuox
    // console.log(loginUser.id);

    const sendFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('file_name', file.name);
        formData.append('path', 'placeholder/path/to/file');
        formData.append('size', file.size.toString());
        formData.append('user_id', loginUser.id.toString()); // вот тут логин пользователя
        // console.log(formData);
        // formData.append('comment', '');
        try {
            const response = await createFile(formData);
            const data = await response.data;
            setFiles(data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <FileContext.Provider value={{ currentStorageUser, setCurrentStorageUser }}>
            <>
                <FileList
                    fileList={files}
                    setCurrentFile={setCurrentFile}
                    currentFile={currentFile}
                />
                <FileAdd sendFile={sendFile} />
                {/* {currentFile
                    ? (
                        <FileEditPanel
                            currentFile={currentFile}
                            setFiles={setFiles}
                            setCurrentFile={setCurrentFile}
                        />
                    )
                    : null} */}
            </>
        </FileContext.Provider>
    )
}

export default FilePage;