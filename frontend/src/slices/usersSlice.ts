import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProps, UserType } from '../models';


const loadInitialState = (): UserProps => {
    const savedState = localStorage.getItem('authState');
    if (savedState) {
        return JSON.parse(savedState) as UserProps;
    }
    return {
        loginUser: null,
        currentUser: null,
        activeState: 'logout', // начальное состояние по умолчанию
        view: 'list',
        isLoading: false,
        error: '',
    };
};

const initialState: UserProps = loadInitialState();

const UsersSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<UserType>) => {
            state.activeState = 'auth';
            state.loginUser = action.payload;
            localStorage.setItem('authState', JSON.stringify(state)); // Сохраняем состояние при успешном входе
        },
        logoutSuccess: (state) => {
            state.activeState = 'logout';
            state.loginUser = null;
            localStorage.setItem('authState', JSON.stringify(state)); // Сохраняем состояние при выходе
        },
    },
});

export const { loginSuccess, logoutSuccess } = UsersSlice.actions;
export default UsersSlice.reducer;


// const usersSlice = createSlice({
//     name: 'user',
//     initialState,
//     reducers: {
//         setLoginUser(state, action) {  // Сеттер для установки залогиненного пользователя
//             state.loginUser = action.payload;
// 			state.currentUser = action.payload;
//             // state.activeState = 'auth';
//         },
//         setCurrentUser(state, action) {
// 			state.currentUser = action.payload;
// 		},
//         clearUser(state) {  // Очистка данных пользователя при логауте
// 			state.loginUser = null;
// 			state.currentUser = null;
//             // state.activeState = 'logout';
// 		},
//         setActiveState(state, action) {     // Установка активного состояния (login/logout)
// 			state.activeState = action.payload;
// 		},
//         setView(state, action) {
//             state.view = action.payload;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addMatcher(userApi.endpoints.loginAction.matchPending, (state) => {
//                 console.log("loginUserPending", state);
//                 state.isLoading = true;       // Показываем индикатор загрузки при ожидании ответа
//             })
//             .addMatcher(userApi.endpoints.loginAction.matchFulfilled, (state, action) => {
//                 console.log("loginUserFulfilled", state, action.payload.user);
//                 state.isLoading = true;
//                 state.currentUser = action.payload.user as UserType;  // Успешный логин, сохраняем текущего пользователя
//                 state.activeState = 'auth';
//                 state.error = "";              // Сбрасываем ошибки
//             })
//             .addMatcher(userApi.endpoints.loginAction.matchRejected, (state, action) => {
//                 console.log("loginUserRejectedIN", state);
//                 state.isLoading = false;
//                 state.error = typeof (action.payload) == 'string' ? action.payload : 'Login failed'; // Установка ошибки при неудаче
//             })
//             .addMatcher(userApi.endpoints.logoutAction.matchPending, (state) => {
//                 console.log("logoutUserPending", state);
//                 // state.isLoading = true;       // Показываем индикатор загрузки при ожидании логаута
//             })
//             .addMatcher(userApi.endpoints.logoutAction.matchFulfilled, (state) => {
//                 console.log("logoutUserFulfilled", state);
//                 state.isLoading = false;
//                 state.currentUser = null;     // Успешный логаут, очищаем данные текущего пользователя
//                 // state.activeState = 'logout';
//                 state.error = "";              // Сбрасываем ошибки
//             })
//             .addMatcher(userApi.endpoints.logoutAction.matchRejected, (state, action) => {
//                 console.log("loginUserRejectedOUT", state);
//                 state.isLoading = false;
//                 state.error = typeof (action.payload) == 'string' ? action.payload : 'Logout failed'; // Установка ошибки при неудаче
//             });
//     },
// });

// export const {
// 	setLoginUser,
// 	setCurrentUser,
// 	clearUser,
// 	setActiveState,
// 	setView,
// } = usersSlice.actions;


// export default usersSlice.reducer;
