import React, { useEffect, useRef, useState } from 'react';
import './FileForm.css';
import { patchFile } from '../../../api/api';
import { FileRenameProps } from '../../../models';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/index.ts';


const FileRename: React.FC<FileRenameProps> = ({ currentFile, setForm, setCurrentFile, setFiles }) => {
  const prefix = import.meta.env.BUILD_PREFIX || '';
  const newFileName = useRef<HTMLInputElement>(null);
  const userId = useSelector((state: RootState) => state.users.loginUser?.id || 0);
  const [currentStorageUser, setCurrentStorageUser] = useState<number>(userId || 0); // Устанавливаем ID текущего пользователя

  const [baseName, setBaseName] = useState('');
  const [fileExtension, setFileExtension] = useState('');

  useEffect(() => {
    // Разделяем имя файла и его расширение при монтировании
    const fileParts = (currentFile.file_name as string).split('.');
    const extension = fileParts.pop();
    setBaseName(fileParts.join('.'));
    setFileExtension(extension ? `.${extension}` : '');
  }, [currentFile.file_name]);

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId) {
      setCurrentStorageUser(userId);
    }
    const newFileNameValue = `${newFileName.current?.value || ''}${fileExtension}`;
    const patchData = {
      ...currentFile,
      file_name: newFileNameValue,
      user_id: userId || currentStorageUser
    };
    console.log(`1: ${currentFile.id}, 2: ${patchData.file_name}, 3: ${currentStorageUser}`);

    const response = await patchFile(patchData, currentStorageUser);
    const data = response.data;
    console.log("Rename info: ", response.data);
    // window.location.reload();
    if (response.status === 200) {
      setCurrentFile(data);
      setFiles((files) =>
        files.map((file) => (file.id === data.id ? data : file))
      );
      setForm();
    }
  };

  const onCloseHandler = () => {
    setForm();
  };

  return (
    <form className="form" onSubmit={onSubmitHandler}>
      <h2 className="form-title">Переименовать:</h2>
      <input type="text" placeholder="new name" ref={newFileName} defaultValue={baseName} />
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
