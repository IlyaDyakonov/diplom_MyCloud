import { FileDescriptionProps } from '../../../../models';
import './FileDescription.css';


const FileDescription: React.FC<FileDescriptionProps> = ({
    upload,
    download,
    size,
    comment,
}) => {
    return (
        <div className="file-description">
            <div className="file-description-item">
                <div className="file-description-name">Upload data</div>
                <div className="file-description-content">{ upload }</div>
            </div>
            <div className="file-description-item">
                <div className="file-description-name">Download date</div>
                <div className="file-description-content">{ download }</div>
            </div>
            <div className="file-description-item">
                <div className="file-description-name">size</div>
                <div className="file-description-content">{ size }</div>
            </div>
            <div className="file-description-item">
                <div className="file-description-name">comment</div>
                <div className="file-description-content">{ comment }</div>
            </div>
        </div>

    )
}

export default FileDescription;