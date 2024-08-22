/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useLoginActionMutation  } from '../api/api';
import { NavLink } from "react-router-dom";
import PasswordInput from "./PasswordIntup";


const Login: React.FC = () => {
	const [ username, setUsername ] = useState<string>("");
	const [ password, setPassword ] = useState<string>("");
	const [ memory, setMemory ] = useState<boolean>(false);
	const [loginAction, { isLoading, error }] = useLoginActionMutation();

	// загрузка из локального хранилища
	useEffect(() => {
		const effectUsername = localStorage.getItem('username');
		const effectPassword = localStorage.getItem('password');

		if (effectUsername && effectPassword) {
			setUsername(effectUsername);
			setPassword(effectPassword);
			setMemory(true);
		}
	}, [])

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const result = await loginAction({ username, password }).unwrap(); // Вызов API
            console.log('Login successful:', result);
		} catch(error: any) {
			console.error('Login failed:', error);
		}

	};

	return (
		<div className="container-login">
			<h2>Логин</h2>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<form method="post" onSubmit={handleLogin}>
				<div>
					<label htmlFor="username">Логин:</label>
					<input
						type="text"
						id='username'
						value={username}
						placeholder='Логин'
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
				<div className="form-group">
					<PasswordInput password={password} setPassword={setPassword} confirm={true}/>
				</div>
				<div>
					<label>
						<input
							type="checkbox"
							checked={memory}
							onChange={(e) => setMemory(e.target.checked)}
						/>
						Запомнить меня
					</label>
				</div>
				<button type='submit' disabled={isLoading}>Войти</button>
			</form>
			<div className="footer">
                <p>Первый раз у нас? <NavLink to="/register">Регистрация</NavLink></p>
				<p><NavLink to="/">Главная страница</NavLink></p>
            </div>
            </div>
	);
};


export default Login;
