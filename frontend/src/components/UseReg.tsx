import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import PasswordInput from "./PasswordIntup";
import { createUser } from "../api/api";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';


const UseReg: React.FC = () => {
	const [ username, setUsername ] = useState<string>("");
	const [ email, setEmail ] = useState<string>('');
	const [ password, setPassword ] = useState<string>("");
	const [ confirmPassword, setConfirmPassword ] = useState<string>('');
	const [ error, setError ] = useState<string | null>(null);

	const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setError("Пароли не совпадают");
			return;
		}

		try {
			const result = await createUser({ username, email, password });
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
				dispatch(setError('login'));
			}
		} catch (err) {
			console.error('Failed to create user:', err);
		}
	};

	return (
		<div className="container-register">
			<h2>Регистрация</h2>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<form method="post" onSubmit={handleRegistration}>
				<div>
					<label htmlFor="username">Ваш логин:</label>
					<input
						type="text"
						id='username'
						value={username}
						className="form-control"
						placeholder="Введите логин"
						autoComplete="off"
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
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
					<PasswordInput password={password} setPassword={setPassword} confirm={true}/>
				</div>
				<div className="form-group">
					<PasswordInput password={confirmPassword} setPassword={setConfirmPassword} confirm={false}/>
				</div>
				<button type='submit'>Зарегестрироваться</button>
			</form>
			<div className="footer">
                <p>Уже зарегестрированы? <NavLink to="/api/login">Вход</NavLink></p>
				<p><NavLink to="/">Главная страница</NavLink></p>
            </div>
		</div>
	);
};


export default UseReg;
