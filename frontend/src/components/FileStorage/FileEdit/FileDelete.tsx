import React from 'react';
// import PropTypes from 'prop-types';
import { deleteFile } from '../../../api/api';
import { FileDeleteProps } from '../../../models';
import './FileForm.css';
// import { useGlobalState } from '../../../models/state';


const  FileDelete: React.FC<FileDeleteProps> = ({
    currentFile, setForm, setFiles, setCurrentFile
}) => {
    const prefix = import.meta.env.BUILD_PREFIX || '';
    // const { globalStorageUser } = useGlobalState();

    const onSubmitHandler = async () => {
        // e.preventDefault()
        if (!currentFile?.id) {
            console.error("currentFile.id is undefined");
            return;
        }

        // let response;
        // if (globalStorageUser) {
            // console.log(`123456789: ${globalStorageUser}`);
            // response = await deleteFile(currentFile.id, globalStorageUser);
        // } else {
            // console.log(`987654321: ${globalStorageUser}`);
        let response = await deleteFile(currentFile.id);
        // }

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