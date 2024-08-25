import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginCredentials, LoginResponse, RegisterResponse, RegisterUser } from '../models';


// Определяем базовый запрос для API, который добавляет CSRF-токен в заголовки
const baseQuery = fetchBaseQuery({
    baseUrl: '/api', // Указываем базовый URL для API запросов
    prepareHeaders: (headers) => {
        const csrfToken = getCookie('csrftoken');
        if (csrfToken) {
            headers.set('X-CSRFToken', csrfToken); // Добавляем CSRF-токен в заголовки
        }
        return headers;
    },
    credentials: 'include', // Включаем куки в запросы
});


// RTK Query API для пользователя
export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery,
    endpoints: (builder) => ({
        // логин пользователя
        loginAction: builder.mutation<LoginResponse, LoginCredentials>({
            query: (credentials) => ({
                url: '/login/',
                method: 'POST',
                body: credentials, // Данные для авторизации (логин/пароль)
            })
        }),
        // логаут пользователя
        logoutAction: builder.mutation<void, void>({
            query: () => ({
                url: '/logout/',
                method: 'POST', // Для логаута используется POST запрос
            }),
        }),
        // регистрация пользователя
        createUser: builder.mutation<RegisterResponse, RegisterUser>({
            query: (userData) => ({
                url: '/register/',
                method: 'POST',
                body: userData, // Данные для регистрации (логин, email, пароль)
            }),
        }),
    })
})

const getCookie = (name: string): string | null => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

export const {
    useLoginActionMutation,
    useLogoutActionMutation,
    useCreateUserMutation,
} = userApi;