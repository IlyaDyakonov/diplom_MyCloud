import { useContext, useRef, useState } from "react";
import Context from '../../FilePage/state';
import './FileAdd.css';


function FileAdd({ sendFile }) {
    const file = useRef();
    const [fileChosen, setFileChosen] = useState();
    const { currentStorageUser } = useContext(Context);

    const onChangeHandler = () => {
        setFileChosen(file.current.files);
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        // sendFile(fileChosen.item(0));
        // // console.log('Файл:', fileChosen.item(0));
        // setFileChosen();
        // file.current.value = '';

        if (fileChosen && fileChosen.length > 0) {
            sendFile(fileChosen.item(0));
            setFileChosen(); // очищаем выбранный файл
            file.current.value = '';
        } else {
            console.error("No file chosen");
        }
    };
    return (
        !currentStorageUser
            ? (
                <form className="file-input-form" onSubmit={onSubmitHandler}>
                    <div className="input-wrapper button">
                        <label htmlFor="input_file">
                            Загрузить файл
                            <input
                                type="file"
                                id="input_file"
                                ref={file}
                                onChange={onChangeHandler}
                            />
                        </label>
                        {fileChosen && fileChosen.length
                            ? <div className="preview">{fileChosen.item(0).name}</div>
                            : null}
                    </div>
                    {fileChosen && fileChosen.length
                        ? <input className="uploadbtn" type="submit" value="👍" />
                        : null}
                </form>
            )
            : null
    );
}


export default FileAdd;