import React, { useContext, useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';
import './FileForm.css';
import { patchFile } from '../../../api/api';
// import state from '../../../../GlobalState/state';
import GlobalStateContext from '../../FilePage/state.ts';
import { FileRenameProps } from '../../../models';


const FileRename: React.FC<FileRenameProps> = ({ currentFile, setForm, setFiles }) => {
    const prefix = import.meta.env.BUILD_PREFIX || '';
    const newFileName = useRef<HTMLInputElement>(null);
    const { currentStorageUser } = useContext(GlobalStateContext);

    useEffect(() => {
        if (newFileName.current) {
            newFileName.current.value = currentFile.native_file_name;
        }
    }, [currentFile]);

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        // const patchData = currentFile;
        // patchData.native_file_name = newFileName.current.value;
        const patchData = { ...currentFile, native_file_name: newFileName.current?.value };

        let response;

        if (currentStorageUser) {
            response = await patchFile(patchData, currentStorageUser);
        } else {
            response = await patchFile(patchData);
        }

        const data = await response.data;

        if (response.status === 200) {
            setFiles(data);
            setForm();
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
                <img src={`${prefix}close.png`} alt="close" className="close"></img>
            </button>
        </form>
    );
}

// FileRename.propTypes = {
//     currentFile: PropTypes.instanceOf(Object).isRequired,
//     setForm: PropTypes.func.isRequired,
//     setFiles: PropTypes.func.isRequired,
// };

export default FileRename;