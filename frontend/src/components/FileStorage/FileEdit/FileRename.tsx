import React, { useContext, useEffect, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
import './FileForm.css';
import { patchFile } from '../../../api/api';
// import state from '../../../../GlobalState/state';
import GlobalStateContext from '../FilePage/state.ts';
import { FileRenameProps } from '../../../models';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/index.ts';


const FileRename: React.FC<FileRenameProps> = ({ currentFile, setForm, setFiles }) => {
    const prefix = import.meta.env.BUILD_PREFIX || '';
    const newFileName = useRef<HTMLInputElement>(null);
    // const { currentStorageUser } = useContext(GlobalStateContext);
    const userId = useSelector((state: RootState) => state.users.loginUser.id);
    const [currentStorageUser, setCurrentStorageUser] = useState<number>(userId || 0); // Устанавливаем ID текущего пользователя

    useEffect(() => {
        if (newFileName.current) {
            newFileName.current.value = currentFile.native_file_name;
        }
    }, [currentFile]);

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userId) {
            setCurrentStorageUser(userId);
        }
        const patchData = { native_file_name: newFileName.current?.value };

        try {
            const response = await patchFile(currentFile.id, patchData, currentStorageUser);
            const data = response.data;

            if (response.status === 200) {
                setFiles(data);  // Обновляем список файлов с новым именем
                setForm();
            }
        } catch (error) {
            console.error('Ошибка при переименовании файла:', error);
        }
    };

    const onCloseHandler = () => {
        setForm();
    };

    return (
        <form className="form" onSubmit={onSubmitHandler}>
            <h2 className="form-title">Переименовать</h2>
            <input type="text" placeholder="new name" ref={newFileName} />
            <input type="submit" value="OK" required />
            <button
                className="close"
                onClick={onCloseHandler}
                type="button"
                aria-label="Close"
            >
                <img src={`${prefix}close.svg`} alt="close" className="close"></img>
            </button>
        </form>
    );
}


export default FileRename;