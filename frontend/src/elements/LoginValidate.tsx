import { useState } from 'react';


const useLoginValidation = () => {
    const [login, setLogin] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const validateLogin = (login: string) => {
        const loginRegex = /^[A-Za-z][A-Za-z0-9]{3,19}$/; // Проверка: первая буква латинская, длина от 4 до 20 символов
        if (!loginRegex.test(login)) {
            return 'Логин должен начинаться с латинской буквы и содержать только латинские буквы и цифры (4-20 символов)';
        }
        return '';
    };

    const handleLoginChange = (newLogin: string) => {
        setLogin(newLogin);
        const validationMessage = validateLogin(newLogin);
        setErrorMessage(validationMessage);
    };

    return { login, errorMessage, handleLoginChange };
};

export default useLoginValidation;