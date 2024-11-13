import FileList from '../FileList/FileList';
import { createFile, getAllFiles, getUserFiles } from '../../../api/api';
import { createContext, useContext, useState, useEffect } from 'react';
import FileAdd from '../FileEdit/FileAdd';
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import FileEditPanel from '../FileEdit/FileEditPanel';


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
                // console.log('Запрос response:', response)
            }
            const data = response.data;
            // console.log('Запрос:', data)
            setFiles(data);
        }
        fetchData();
    }, [currentStorageUser, userId])

    const loginUser = useSelector((state: RootState) => state.users.loginUser); // loginUser.name: apuox

    const sendFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('file_name', file.name);
        formData.append('path', `uploads/${loginUser.username}_folder/${file.name}`);
        formData.append('size', file.size.toString());
        formData.append('user_id', loginUser.id.toString()); // вот тут ID пользователя
        console.log(`formData1: ${formData.get('size')}`);
        console.log(`formData2: ${formData.get('path')}`);
        console.log(`formData3: ${formData.get('user_id')}`);
        // console.log(formData);
        // formData.append('comment', '');
        try {
            const response = await createFile(formData);
            console.log(`formData: ${formData}`);
            // const data = await response.data;
            setFiles(response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };
    // console.error('currentFilecurrentFilecurrentFilecurrentFile:', currentFile);
    
    return (
        <FileContext.Provider value={{ currentStorageUser, setCurrentStorageUser }}>
            <>
                <FileList
                    fileList={files}
                    setCurrentFile={setCurrentFile}
                    currentFile={currentFile}
                    currentUser={loginUser.id}
                />
                { currentFile
                    && (
                        <FileEditPanel
                            currentFile={currentFile}
                            setFiles={setFiles}
                            setCurrentFile={setCurrentFile}
                        />
                    )}
                <FileAdd sendFile={sendFile} />

            </>
        </FileContext.Provider>
    )
}

export default FilePage;