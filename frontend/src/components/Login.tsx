/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useLoginActionMutation  } from '../api/api';
import { NavLink, useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordIntup";
import { useDispatch } from "react-redux";
import getError from "../hooks/GetError";
import {setActiveState, setLoginUser} from "../slices/usersSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";


const Login: React.FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [ username, setUsername ] = useState<string>("");
	const [ password, setPassword ] = useState<string>("");
	const [ memory, setMemory ] = useState<boolean>(false);
	const [loginAction, { isLoading, error }] = useLoginActionMutation();
	const [errorMessage, setErrorMessage] = useState<string>('');

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
			if (!isLoading) {
				if (memory) {
					localStorage.setItem('username', username);
					localStorage.setItem('password', password);
				} else {
					localStorage.removeItem('username');
					localStorage.removeItem('password');
				}
				console.log('Логин:', username, 'Пароль:', password);
				const response = await loginAction({username, password});
				if (response && response.error && 'error' in response) {
					setErrorMessage(getError(response.error));
				} else {
					console.log('Успешный вход:', response.data);
					sessionStorage.setItem('loginUser', JSON.stringify(response.data.user));
					dispatch(setLoginUser(response.data.user));
					dispatch(setActiveState('login'));
					navigate('/');
				}
			}
		} catch (error) {
			console.error('Ошибка входа:', error);
			const errorMessage = getError(error as FetchBaseQueryError | SerializedError);
			setErrorMessage(errorMessage);
		}
	};

	return (
		<div className="container-login">
			<h2>Логин</h2>
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
				{error && <p style={{ color: 'red' }}>{errorMessage}</p>}
			</form>
			<div className="footer">
                <p>Первый раз у нас? <NavLink to="/register">Регистрация</NavLink></p>
            </div>
            </div>
	);
};


export default Login;
