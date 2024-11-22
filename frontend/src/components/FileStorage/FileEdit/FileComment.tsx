import React, { useEffect, useRef, useState } from 'react';
import { patchFile } from '../../../api/api';
import { FileCommentProps } from '../../../models';
import './FileForm.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/index.ts';
import axios from 'axios';


const FileComment: React.FC<FileCommentProps> = ({ currentFile, setForm, setFiles }) => {
    const prefix = import.meta.env.BUILD_PREFIX || '';
    const newComment = useRef<HTMLTextAreaElement>(null);
    // const { currentStorageUser } = useContext(GlobalStateContext);
    const loginUser = useSelector((state: RootState) => state.users.loginUser);
    const userId = loginUser ? loginUser.id : 0; // Если loginUser null, устанавливаем userId в 0
    const [currentStorageUser, setCurrentStorageUser] = useState<number>(userId || 0); // Устанавливаем ID текущего пользователя


    useEffect(() => {
        if (newComment.current) {
            newComment.current.value = currentFile.comment || '';
        }
    }, [currentFile.comment]);

    console.log(`userId: ${userId}`);
    console.log(`currentStorageUser: ${currentStorageUser}`);

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userId) {
            setCurrentStorageUser(userId);
        }

        const patchData = {
            ...currentFile,
            comment: newComment.current?.value || '',
            user_id: userId || currentStorageUser  // Используем userId или currentStorageUser, если userId пуст
        };
        console.log(`patchData: ${JSON.stringify(patchData, null, 2)}`);
        console.log(`currentFile: ${JSON.stringify(currentFile, null, 2)}`);

        try {
            let response;
            if (currentStorageUser) {
                console.log(111);
                response = await patchFile(patchData, currentStorageUser);
                console.log(`response111: ${response}`);
            } else {
                console.log(222);
                response = await patchFile(patchData);
                console.log(`response222: ${response}`);
            }
            const data = await response.data;
            console.log(333);
            window.location.reload();
            if (response.status === 200) {
                setFiles(data);
                setForm();
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                // Обработка ошибок Axios
                console.error("Ошибка при выполнении patchFile:", error.response?.data || error.message);
            } else if (error instanceof Error) {
                // Обработка стандартных ошибок JavaScript
                console.error("Ошибка при выполнении patchFile:", error.message);
            } else {
                // Неизвестный тип ошибки
                console.error("Неизвестная ошибка:", error);
            }}
    };

    const onCloseHandler = () => {
        setForm();
    };

    return (
        <form className="form" onSubmit={onSubmitHandler}>
            <h2 className="form-title">Изм. комментарий</h2>
            <textarea placeholder="Новый комментарий" ref={newComment} />
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


export default FileComment;