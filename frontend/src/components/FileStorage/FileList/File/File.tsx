/* eslint-disable @typescript-eslint/no-unused-vars */
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
}) => {
	const [ showComment, setShowComment ] = useState(false);

	const onMouseOverHandler = () => {
		setShowComment(true);
	}
	const onMouseLeaveHandler = () => {
		setShowComment(false);
	}

    return (
        <div className="file"
            onMouseOver={onMouseOverHandler}
			onMouseLeave={onMouseLeaveHandler}
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