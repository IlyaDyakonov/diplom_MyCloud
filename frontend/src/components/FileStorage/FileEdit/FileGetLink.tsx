import React, { useRef } from 'react';
import { FileGetLinkProps } from '../../../models';
import './FileForm.css';


// let inputRef = null

function FileGetLink({ link, setForm }: FileGetLinkProps) {
    const prefix = import.meta.env.BUILD_PREFIX || '';
    const inputRef = useRef<HTMLInputElement>(null);

    const onCloseHandler = () => {
        setForm();
    };

    function CopyToClipboard() {
        if (inputRef.current) {
            inputRef.current.select();
            navigator.clipboard.writeText(inputRef.current.value);
        }
    }

    return (
        <form className="form">
            <h2 className="form--title">Ваша ссылка для скачивания</h2>
            <input type="text" ref={inputRef} onClick={CopyToClipboard} readOnly value={link} />
            <p className='description'>Нажмите на ссылку чтобы скопировать</p>
            <button 
                className="close"
                onClick={onCloseHandler}
                aria-label="Close"
                type="button"
            >
                <img src={`${prefix}close.png`} alt="close" className="close"></img>
            </button>
        </form>
    );
}

// FileGetLink.propTypes = {
//     link: PropTypes.string.isRequired,
//     setForm: PropTypes.func.isRequired,
// };

export default FileGetLink;