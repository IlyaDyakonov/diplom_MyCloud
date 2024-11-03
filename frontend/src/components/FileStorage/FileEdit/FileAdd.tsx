import { createContext, useContext, useRef, useState } from "react";
// import Context from '../../FilePage/state';
import './FileAdd.css';
import { FileAddProps } from "../../../models";


// РАЗОБРАТЬСЯ ВОТ ТУТ С КОНТЕКСТОМ И ID ПОЛЬЗОВАТЕЛЯ КОТОРОЕ ПЕРЕДАЁМ
const FileContext = createContext<{
    currentStorageUser: number;
    setCurrentStorageUser: (userId: number) => void;
}>({
    currentStorageUser: 0,
    setCurrentStorageUser: () => {},
});


function FileAdd({ sendFile }: FileAddProps) {
    const file = useRef<HTMLInputElement | null>(null); // Реф на input для выбора файлов
    const [fileChosen, setFileChosen] = useState<FileList | null>(null); // Состояние выбранных файлов
    const { currentStorageUser } = useContext(FileContext); // Получаем ID пользователя из контекста

    // Обработчик выбора файла
    const onChangeHandler = () => {
        if (file.current) { // Проверка, что file.current существует
            setFileChosen(file.current.files); // Устанавливаем выбранный файл в состояние
        }
    };

    // Обработчик отправки формы
    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы

        // Проверка, что файл выбран
        if (fileChosen && fileChosen.length > 0) {
            sendFile(fileChosen.item(0)); // Передача выбранного файла через функцию отправки
            setFileChosen(null); // Очищаем выбранный файл после отправки
            if (file.current) { // Сбрасываем значение input
                file.current.value = '';
            }
        } else {
            console.error("No file chosen"); // Логируем ошибку, если файл не выбран
        }
    };

    return (
        !currentStorageUser ? ( // Показываем форму только если текущий пользователь не задан
            <form className="file-input-form" onSubmit={onSubmitHandler}>
                <div className="input-wrapper button">
                    <label htmlFor="input_file">
                        Выбрать файл
                        <input
                            type="file"
                            id="input_file"
                            ref={file} // Привязываем ref к input
                            onChange={onChangeHandler} // Обработчик изменения выбора файлов
                        />
                    </label>
                    {/* Отображаем превью выбранного файла, если он выбран */}
                    {fileChosen && fileChosen.length > 0 ? (
                        <div className="preview">{fileChosen.item(0)?.name}</div>
                    ) : null}
                </div>
                {/* Отображаем кнопку загрузки только если файл выбран */}
                {fileChosen && fileChosen.length > 0 ? (
                    <input className="uploadbtn" type="submit" value="Загрузить в облако 👍" />
                ) : null}
            </form>
        ) : null
    );
}

export default FileAdd;