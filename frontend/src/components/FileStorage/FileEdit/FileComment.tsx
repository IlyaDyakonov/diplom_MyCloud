import React, { useContext, useEffect, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
import { patchFile } from '../../../api/api';
import GlobalStateContext from '../../FilePage/state.ts';
import { FileCommentProps } from '../../../models';
import './FileForm.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/index.ts';


const FileComment: React.FC<FileCommentProps> = ({ currentFile, setForm, setFiles }) => {
    const prefix = import.meta.env.BUILD_PREFIX || '';
    const newComment = useRef<HTMLTextAreaElement>(null);
    // const { currentStorageUser } = useContext(GlobalStateContext);
    const userId = useSelector((state: RootState) => state.users.loginUser.id);
    const [currentStorageUser, setCurrentStorageUser] = useState<number>(userId || 0); // Устанавливаем ID текущего пользователя

    useEffect(() => {
        if (newComment.current) {
            newComment.current.value = currentFile.comment;
        }
    }, [currentFile.comment]);

    console.log(`userId: ${userId}`);
    console.log(`currentStorageUser: ${currentStorageUser}`);

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userId) {
            setCurrentStorageUser(userId);
        }
        const patchData = currentFile;
        patchData.comment = newComment.current.value;

        let response;
        
        if (currentStorageUser) {
            response = await patchFile(patchData, currentStorageUser);
            console.log(`response1: ${response}`);
        } else {
            response = await patchFile(patchData);
            console.log(`response2: ${response}`);
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