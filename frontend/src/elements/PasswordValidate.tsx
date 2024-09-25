import { useState } from "react";


export const PasswordInput: React.FC<{password: string, setPassword: (password: string) => void, confirm: boolean}> = ({ password, setPassword, confirm }) => {

    return (
        <>
            <label htmlFor={confirm ? 'password' : 'confirmPassword'}>{confirm ? 'Пароль:' : 'Подтвердите пароль:'}</label>
            <input
                type="password"
                value={password}
                className="form-control"
                id={confirm ? 'password' : 'confirmPassword'}
                placeholder='Пароль'
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
            />
        </>
    )
}


export const PasswordValidation: React.FC<{password: string, setPassword: (password: string) => void, confirm: boolean, setIsDisabled: (disabled: boolean) => void}> = ({ password, setPassword, confirm, setIsDisabled }) => {
// export const PasswordValidation: React.FC<{password: string, setPassword: (password: string) => void, confirm: boolean}> = ({ password, setPassword, confirm }) => {
    const [errorMessage, setErrorMessage] = useState<string>('');

    const validatePassword = (password: string) => {
        const minLength = 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasRusCase = /[а-яА-Я]/.test(password);

        if (hasRusCase) {
            return 'Нельзя использовать Русские буквы в пароле';
        }
        if (!hasUpperCase) {
            return 'Пароль должен содержать хотя бы одну заглавную букву';
        }
        if (!hasLowerCase) {
            return 'Пароль должен содержать хотя бы одну строчную букву';
        }
        if (!hasNumbers) {
            return 'Пароль должен содержать хотя бы одну цифру';
        }
        if (!hasSpecialChars) {
            return 'Пароль должен содержать хотя бы один специальный символ';
        }
        if (password.length < minLength) {
            return 'Пароль должен содержать не менее 6 символов';
        }
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const validationMessage = validatePassword(newPassword);
        setErrorMessage(validationMessage);

        if (validationMessage) {
            setIsDisabled(true); // Если есть ошибка, отключаем кнопку
        } else {
            setIsDisabled(false); // Если ошибок нет, включаем кнопку
        }
    };

    return (
        <>
            <label htmlFor={confirm ? 'password' : 'confirmPassword'}>
                {confirm ? 'Пароль:' : 'Подтвердите пароль:'}
            </label>
            <input
                type="password"
                value={password}
                className={`form-control ${errorMessage ? 'is-invalid' : ''}`}
                id={confirm ? 'password' : 'confirmPassword'}
                placeholder='Пароль'
                autoComplete="off"
                onChange={handleChange}
            />
            {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
        </>
    );
};
