import './SignUp.css';
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PasswordValidation } from "../../elements/PasswordValidate.tsx";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import useLoginValidation from '../../elements/LoginValidate.tsx';
import { signUp } from "../../api/api.ts";


const SignUp = () => {

	const navigate = useNavigate();

	const [ email, setEmail ] = useState<string>('');
	const [ password, setPassword ] = useState<string>('');
	const [ confirmPassword, setConfirmPassword ] = useState<string>('');
	const [ error, setError ] = useState<string | null>(null);
	const [ isDisabled, setIsDisabled] = useState<boolean>(true);
	const { login, errorMessage: loginError, handleLoginChange } = useLoginValidation(setIsDisabled);

	const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setError("Пароли не совпадают");
			return;
		}
		if (loginError) {
			setError(loginError);
			return;
		}

		try {
			const result = await signUp({ username: login, email, password });
			if (result.error ) {
                if ('data' in result.error && result.error?.data) {
                    const typedError: FetchBaseQueryError = result.error.data as FetchBaseQueryError;
                    if ('detail' in typedError) {
                        const error = typedError.detail;
                        console.error('Error creating user:', error);
                        setError(`Ошибка:  ${error}`);
                    }
				} else {
					console.error('Error creating user (no data):', result.error);
					setError('Ошибка: Не удалось получить детали ошибки.');
				}
			} else {
				console.log('User created successfully', result.data);
				navigate('/login');
			}
		} catch (err) {
			console.error('Failed to create user:', err);
			setError(`Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
		}
	};

	useEffect(() => {
		// массив состояние
		const condition = false;
		if (condition) {
			setIsDisabled(true);
		} else {
			setIsDisabled(false);
		}
	}, [])


	return (
		<div className="container-register">
			<h2>Регистрация</h2>
			<form method="post" onSubmit={handleRegistration}>
				<div>
					<label htmlFor="username">Логин:</label>
					<input
						type="text"
						id='username'
						value={login}
						className="form-control"
						placeholder="Введите логин"
						autoComplete="off"
						onChange={(e) => handleLoginChange(e.target.value)}
						required
					/>
					{loginError && <p style={{ color: 'red' }}>{loginError}</p>}
				</div>
				<div>
					<label htmlFor="email">Email:</label>
						<input
							type="email"
							id='email'
							value={email}
							className="form-control"
							placeholder="Введите email"
							autoComplete="off"
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
				</div>
				<div className="form-group">
					<PasswordValidation password={password} setPassword={setPassword} confirm={true} setIsDisabled={setIsDisabled}/>
				</div>
				<div className="form-group">
					<PasswordValidation password={confirmPassword} setPassword={setConfirmPassword} confirm={false} setIsDisabled={setIsDisabled}/>
				</div>
				<button type='submit' className='button-submit' disabled={isDisabled}>Зарегестрироваться</button>
				{error && <p style={{ color: 'red' }}>{error}</p>}
			</form>
			<div className="login">
                <p>Уже зарегестрированы? <NavLink to="/login">Вход</NavLink></p>
            </div>
		</div>
	);
};

export default SignUp;
