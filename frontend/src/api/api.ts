/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';


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


// Функция для получения CSRF токена
const getCSRFToken = (): string | null => {
    return getCookie('csrftoken');  // Используем вашу функцию для получения CSRF токена
};

// Универсальная функция для обработки запросов на сервер
const apiRequest = async (method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, data?: any, headers?: any) => {
    try {
        const csrfToken = getCSRFToken();
        const config = {
            method,
            url,
            data,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken || '',
                ...headers,
            },
            withCredentials: true,  // для того чтобы отправлять куки с запросом
        };

        const response = await axios(config);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Произошла ошибка при запросе');
    }
};

// Пример запроса на логин
export const loginUser = async (username: string, password: string) => {
    const data = { username, password };
    return await apiRequest('POST', '/api/login/', data);
};

// Пример запроса на регистрацию
export const createUser = async (userData: { username: string; email: string; password: string }) => {
    return await apiRequest('POST', '/api/register/', userData);
};

// Добавляем новые запросы в будущем
// export const fetchUserProfile = async () => {
//     return await apiRequest('GET', '/api/profile/');
// };

// Пример запроса на обновление профиля
// export const updateUserProfile = async (profileData: any) => {
//     return await apiRequest('PUT', '/api/profile/update/', profileData);
// };
