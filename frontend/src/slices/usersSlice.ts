import { createSlice } from '@reduxjs/toolkit';
import { UserProps } from '../models';
import { userApi } from '../api/api';


const initialState: UserProps = {
	loginUser: null,
	currentUser: null,
	activeState: 'logout',
	view: 'list',
	isLoading: false,
	error: '',
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setLoginUser(state, action) {  // Сеттер для установки залогиненного пользователя
            state.loginUser = action.payload;
			state.currentUser = action.payload;
        },
        clearUser(state) {  // Очистка данных пользователя при логауте
			state.loginUser = null;
			state.currentUser = null;
		},
        setActiveState(state, action) {     // Установка активного состояния (login/logout)
			state.activeState = action.payload;
		},
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(userApi.endpoints.loginAction.matchPending, (state) => {
                console.log("loginUserPending", state);
                state.isLoading = true;       // Показываем индикатор загрузки при ожидании ответа
            })
            .addMatcher(userApi.endpoints.loginAction.matchFulfilled, (state, action) => {
                console.log("loginUserFulfilled", state, action.payload.user);
                state.isLoading = false;
                state.currentUser = action.payload.user;  // Успешный логин, сохраняем текущего пользователя
                state.error = "";              // Сбрасываем ошибки
            })
            .addMatcher(userApi.endpoints.loginAction.matchRejected, (state, action) => {
                console.log("loginUserRejected", state);
                state.isLoading = false;
                state.error = typeof (action.payload) == 'string' ? action.payload : 'Login failed'; // Установка ошибки при неудаче
            })
            .addMatcher(userApi.endpoints.logoutAction.matchPending, (state) => {
                console.log("logoutUserPending", state);
                state.isLoading = true;       // Показываем индикатор загрузки при ожидании логаута
            })
            .addMatcher(userApi.endpoints.logoutAction.matchFulfilled, (state) => {
                console.log("logoutUserFulfilled", state);
                state.isLoading = false;
                state.currentUser = null;     // Успешный логаут, очищаем данные текущего пользователя
                state.error = "";              // Сбрасываем ошибки
            })
            .addMatcher(userApi.endpoints.logoutAction.matchRejected, (state, action) => {
                console.log("loginUserRejected", state);
                state.isLoading = false;
                state.error = typeof (action.payload) == 'string' ? action.payload : 'Logout failed'; // Установка ошибки при неудаче
            });
    },
})

export const {
	setLoginUser,
	setCurrentUser,
	clearUser,
	setActiveState,
	setView,
} = usersSlice.actions;


export default usersSlice.reducer;
