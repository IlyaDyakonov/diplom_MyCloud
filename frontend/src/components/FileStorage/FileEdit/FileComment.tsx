import React, { useContext, useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';
import { patchFile } from '../../../api/api';
import GlobalStateContext from '../../FilePage/state.ts';
import { FileCommentProps } from '../../../models';
import './FileForm.css';


const FileComment: React.FC<FileCommentProps> = ({ currentFile, setForm, setFiles }) => {
    const prefix = import.meta.env.BUILD_PREFIX || '';
    const newComment = useRef<HTMLTextAreaElement>(null);
    const { currentStorageUser } = useContext(GlobalStateContext);

    useEffect(() => {
        if (newComment.current) {
            newComment.current.value = currentFile.comment;
        }
    }, [currentFile.comment]);

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        const patchData = currentFile;
        patchData.comment = newComment.current.value;

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
            <h2 className="form-title">Изм. комментарий</h2>
            <textarea type="text" placeholder="Новый комментарий" ref={newComment} />
            <input type="submit" value="OK" required />
            <button
                className="close"
                onClick={onCloseHandler}
                onKeyDown={onCloseHandler}
                type="button"
                aria-label="Close"
            >
                <img src={`${prefix}close.svg`} alt="close" className="close"></img>
            </button>
        </form>
    );
}

// FileComment.propTypes = {
//     currentFile: PropTypes.instanceOf(Object).isRequired,
//     setForm: PropTypes.func.isRequired,
//     setFiles: PropTypes.func.isRequired,
// };

export default FileComment;