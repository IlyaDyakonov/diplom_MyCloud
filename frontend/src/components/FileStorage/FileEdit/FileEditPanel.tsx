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
                const response = await getDownloadLink(currentFile.id);
                const data = response.data;
                console.log(`response in FileEditPanel: ${response}`)
                console.log(`data in FileEditPanel: ${data}`)

                const downloadResponse = await downloadFile(data.link);
                const downloadData = new Blob([downloadResponse.data]);

                const fileURL = window.URL.createObjectURL(downloadData);
                const link = document.createElement('a');
                link.href = fileURL;
                link.download = currentFile.native_file_name;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setCurrentFile();
            };

            downloadFileHandler();
        }

        if (action === 'getLink') {
            const getLink = async () => {
                const response = await getDownloadLink(currentFile.id);
                const data = await response.data;

                const link = `${BASE_URL}link/${data.link}/`;
                setDownloadLink(link);
            };

            getLink();
        }

        setPatchForm(action);
    };

    return (
        <>
            <div className="file-edit-panel">
                <div className="file-edit-panel--item" onClick={() => onClickHandler('rename')} onKeyDown={() => onClickHandler('rename')} role="button" tabIndex={0}>Переименовать</div>
                <div className="file-edit-panel--item" onClick={() => onClickHandler('changeComment')} onKeyDown={() => onClickHandler('changeComment')} role="button" tabIndex={0}>Изм. комментарий</div>
                <div className="file-edit-panel--item" onClick={() => onClickHandler('download')} onKeyDown={() => onClickHandler('download')} role="button" tabIndex={0}>Скачать</div>
                <div className="file-edit-panel--item" onClick={() => onClickHandler('getLink')} onKeyDown={() => onClickHandler('getLink')} role="button" tabIndex={0}>Создать ссылку</div>
                <div className="file-edit-panel--item" onClick={() => onClickHandler('delete')} onKeyDown={() => onClickHandler('delete')} role="button" tabIndex={0}>Удалить</div>
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

// FileEditPanel.propTypes = {
//     currentFile: PropTypes.instanceOf(Object).isRequired,
//     setCurrentFile: PropTypes.func.isRequired,
//     setFiles: PropTypes.func.isRequired,
// };

export default FileEditPanel;