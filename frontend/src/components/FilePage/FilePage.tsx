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
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [files, setFiles] = useState<any[]>([]);
    const { currentStorageUser: currentStorageUserId } = useContext(FileContext);

    useEffect(() => {
        const fetchData = async () => {
            let response;

            if (currentStorageUserId) {
                response = await getUserFiles(currentStorageUserId);
            } else {
                response = await getAllFiles();
            }
            const data = response.data;
            console.log(currentStorageUserId);
            setFiles(data);
        }
        fetchData();
    }, [currentStorageUserId])

    const loginUser = useSelector((state: RootState) => state.users.loginUser); // loginUser.name: apuox
    // console.log(loginUser.id);

    const sendFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        // formData.append('file_name', file.name);
        // formData.append('path', 'placeholder/path/to/file');
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
        <FileContext.Provider value={{ currentStorageUser: 0, setCurrentStorageUser: () => {} }}>
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