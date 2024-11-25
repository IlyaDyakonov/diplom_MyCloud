import { useState } from 'react';
import { FileProps } from '../../../../models';
import FileDescription from './FileDescription';
import "./File.css";

const File: React.FC<FileProps> = ({
	id,
	file_name,
	upload_date,
	last_download_date,
	comment,
	size,
	currentFile,
    setCurrentFile,
	isOtherUserFile
}) => {
	const [ showComment, setShowComment ] = useState(false);

	const onMouseOverHandler = () => {
		setShowComment(true);
	}
	const onMouseLeaveHandler = () => {
		setShowComment(false);
	}

	const handleClick = () => {
		// Снять выделение, если клик происходит по уже выбранному файлу
		if (currentFile?.id === id) {
			setCurrentFile(null);
		} else {
			setCurrentFile({
				id,
				file_name,
				upload_date,
				last_download_date,
				comment,
				size,
				user: ''
			})}};

    return (
		<div className={`file ${currentFile?.id === id ? 'selected' : ''} ${isOtherUserFile ? 'file-other-user' : ''}`}
            onMouseOver={onMouseOverHandler}
			onMouseLeave={onMouseLeaveHandler}
			onClick={handleClick}
		>
			<div className={`file-name ${id}`}>{file_name}</div>
			{ showComment 
			? (
				<FileDescription
					upload={upload_date}
					download={last_download_date}
					size={size}
					comment={comment} />
			)
			: null}
        </div>
    )
}

export default File;