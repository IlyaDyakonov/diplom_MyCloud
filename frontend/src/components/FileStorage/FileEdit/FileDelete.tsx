import React from 'react';
import { deleteFile } from '../../../api/api';
import { FileDeleteProps } from '../../../models';
import './FileForm.css';


const  FileDelete: React.FC<FileDeleteProps> = ({
    currentFile, setForm, setFiles, setCurrentFile
}) => {
    const prefix = import.meta.env.BUILD_PREFIX || '';

    const onSubmitHandler = async () => {
        if (!currentFile?.id) {
            console.error("currentFile.id is undefined");
            return;
        }

        let response = await deleteFile(currentFile.id);

        const data = response.data;

        if (response.status === 200) {
            setFiles(data);
            setCurrentFile();
            setForm();
        }
    };

    const onCloseHandler = () => {
        setForm();
    };

    return (
        <form className="form" onSubmit={onSubmitHandler}>
            <h2
                className="form--title"
            >
                Вы уверены что хотите удалить этот файл?
            </h2>
            <input type="submit" value="Да" required />
            <button
                className="close"
                onClick={onCloseHandler}
                onKeyDown={onCloseHandler}
                type="button"
                aria-label="Close"
            >
                <img src={`${prefix}close.svg`} alt="close" className="close"></img>
            </button>
            <div
                className="no"
                onClick={onCloseHandler}
                onKeyDown={onCloseHandler}
                role="button"
                tabIndex={0}
            >
                Нет
            </div>
        </form>
    );
}

export default FileDelete;