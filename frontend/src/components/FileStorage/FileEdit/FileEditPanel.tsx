import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import FileRename from './FileRename';
import FileDelete from './FileDelete';
import FileGetLink from './FileGetLink';
import FileComment from './FileComment';
import { downloadFile, getDownloadLink, BASE_URL } from '../../../api/api';
import { FileEditPanelProps } from '../../../models';
import './FileEditPanel.css';


function FileEditPanel({ currentFile, setCurrentFile, setFiles }: FileEditPanelProps) {
    const [patchForm, setPatchForm] = useState<string | undefined>();
    const [downloadLink, setDownloadLink] = useState<string | undefined>();

    const onClickHandler = (action: string) => {    
        if (action === 'download') {
            const downloadFileHandler = async () => {
                try {
                    // Получаем ссылку для скачивания
                    const response = await getDownloadLink(currentFile.id);
                    const data = response.data;
                    const link = `${BASE_URL}/link/${data.link}/`;
    
                    // Создаем элемент ссылки и инициируем загрузку
                    const a = document.createElement('a');
                    a.href = link;
                    a.download = currentFile.file_name; // задаем имя загружаемого файла
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    setCurrentFile(); // Сброс состояния
                } catch (error) {
                    console.error('Ошибка при загрузке файла:', error);
                }
            };
            downloadFileHandler();
        }
    
        if (action === 'getLink') {
            const getLink = async () => {
                try {
                    const response = await getDownloadLink(currentFile.id);
                    const data = response.data;
                    const link = `${BASE_URL}/link/${data.link}/`;
                    console.log(`Ссылка для скачивания: ${link}`);
                    setDownloadLink(link);
                } catch (error) {
                    console.error("Ошибка при получении ссылки:", error);
                }
            };
            getLink();
        }
    
        setPatchForm(action);
    };
    // console.log(`setPatchForm: ${currentFile}`);
    // console.log(`patchForm: ${patchForm}`);
    return (
        <>
            <div className="file-edit-panel">
                <div className="file-edit-panel--item" onClick={() => onClickHandler('rename')} onKeyDown={() => onClickHandler('rename')} role="button" tabIndex={0}>Rename</div>
                <div className="file-edit-panel--item" onClick={() => onClickHandler('changeComment')} onKeyDown={() => onClickHandler('changeComment')} role="button" tabIndex={0}>Edit coment</div>
                <div className="file-edit-panel--item" onClick={() => onClickHandler('download')} onKeyDown={() => onClickHandler('download')} role="button" tabIndex={0}>Download</div>
                <div className="file-edit-panel--item" onClick={() => onClickHandler('getLink')} onKeyDown={() => onClickHandler('getLink')} role="button" tabIndex={0}>Create link</div>
                <div className="file-edit-panel--item" onClick={() => onClickHandler('delete')} onKeyDown={() => onClickHandler('delete')} role="button" tabIndex={0}>Delete</div>
            </div>
            {patchForm === 'rename'
                ? (
                    <FileRename
                        currentFile={currentFile}
                        setForm={setPatchForm}
                        setFiles={setFiles}
                    />
                )
                : null}
            {patchForm === 'changeComment'
                ? (
                    <FileComment
                        currentFile={currentFile}
                        setForm={setPatchForm}
                        setFiles={setFiles}
                    />
                )
                : null}
            {patchForm === 'delete'
                ? (
                    <FileDelete
                        currentFile={currentFile}
                        setForm={setPatchForm}
                        setFiles={setFiles}
                        setCurrentFile={setCurrentFile}
                    />
                )
                : null}
            {patchForm === 'getLink' && downloadLink
                ? (
                    <FileGetLink
                        link={downloadLink}
                        setForm={setPatchForm}
                    />
                )
                : null}
        </>
    );
}

export default FileEditPanel;