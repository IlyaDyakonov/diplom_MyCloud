import axios from 'axios';


const BASE_URL = '/api';

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

// Определяем базовый запрос для API, который добавляет CSRF-токен в заголовки
// const baseQuery = fetchBaseQuery({
//     baseUrl: '/api', // Указываем базовый URL для API запросов
//     credentials: 'include',
//     prepareHeaders: (headers) => {
//         const csrfToken = getCookie('csrftoken');
//         if (csrfToken) {
//             headers.set('X-CSRFToken', csrfToken); // Добавляем CSRF-токен в заголовки
//         }
//         return headers;
//     },
// });

export async function signUp(data: { email: string; password: string; username: string }) {
    try {
        const response = await axios.post(`${BASE_URL}/register/`, data, {
            headers: {
                'X-CSRFToken': getCookie('csrftoken') || '', // Получаем CSRF-токен из cookie
                'Content-Type': 'application/json',
            },
            withCredentials: true, // Включаем передачу кук
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function logIn(username: string, password: string) {
    try {
        const response = await fetch(`${BASE_URL}/login/`, {
            method: 'POST',
            credentials: 'include', // Включаем передачу кук
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') || '', // Получаем CSRF-токен из cookie
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });
        if (!response.ok) {
            throw new Error('Ошибка авторизации');
        }

        return response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
