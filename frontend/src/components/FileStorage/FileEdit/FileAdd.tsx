import { createContext, useContext, useRef, useState } from "react";
// import Context from '../../FilePage/state';
import './FileAdd.css';
import { FileAddProps } from "../../../models";


const FileContext = createContext<{
    currentStorageUser: number;
    setCurrentStorageUser: (userId: number) => void;
}>({
    currentStorageUser: 0,
    setCurrentStorageUser: () => {},
});

function FileAdd({ sendFile }: FileAddProps) {
    const file = useRef<HTMLInputElement | null>(null);
    const [fileChosen, setFileChosen] = useState<FileList | null>(null);
    const { currentStorageUser } = useContext(FileContext);

    const onChangeHandler = () => {
        if (file.current) { // Исправлено: проверка на наличие file.current
            setFileChosen(file.current.files);
        }
    };

    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // sendFile(fileChosen.item(0));
        // // console.log('Файл:', fileChosen.item(0));
        // setFileChosen();
        // file.current.value = '';

        if (fileChosen && fileChosen.length > 0) {
            sendFile(fileChosen.item(0));
            setFileChosen(null); // очищаем выбранный файл
            console.log(fileChosen);

            if (file.current) { // Исправлено: проверка на наличие file.current
                file.current.value = ''; // Сбрасываем значение input
            }
            // console.log(file.current.value);
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
                            Выбрать файл
                            <input
                                type="file"
                                id="input_file"
                                ref={file}
                                onChange={onChangeHandler}
                            />
                        </label>
                        {fileChosen && fileChosen.length > 0 ? (
                            <div className="preview">{fileChosen.item(0).name}</div>
                            ) : null}
                    </div>
                    {fileChosen && fileChosen.length
                        ? <input className="uploadbtn" type="submit" value="Загрузить в облако 👍" />
                        : null}
                </form>
            )
            : null
    );
}


export default FileAdd;