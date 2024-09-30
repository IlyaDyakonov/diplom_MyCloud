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
                'X-CSRFToken': getCookie('csrftoken') || '', // Получаем CSRF-токен из cookie
                'Content-Type': 'application/json',
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

export async function logOut(username: string) {
    try {
        console.log('логоут');
        const response = await fetch(`${BASE_URL}/logout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') || '',
                // cookie: `sessionid=${getCookie('sessionid')}`,
            },
            body: JSON.stringify({ username: username }),
        });
        return response
    } catch (error) {
        console.error('Logout request failed:', error);
        throw error;
    }
}

export async function getAllFiles() {
    try {
        return axios.get(`${BASE_URL}/files/`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
    console.error('Error getting All files: ', error);
    throw error;
    }
}

export async function getUserFiles(user_id: string) {
    try {
        return axios.get(`${BASE_URL}/files/user_id=${user_id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
    console.error('Error getting files: ', error);
    throw error;
    }
}

export async function createFile(data: FormData) {
    try {
        const response = await axios.post(`${BASE_URL}/files/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data', // Указываем тип контента для загрузки файлов
                'X-CSRFToken': getCookie('csrftoken') || '', // Добавляем CSRF-токен
            },
            withCredentials: true, // Включаем передачу кук
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Сервер вернул ответ с кодом ошибки
            console.error('Ошибка от сервера:', error.response.data);
        } else if (error.request) {
            // Запрос был отправлен, но ответа не было
            console.error('Ошибка запроса:', error.request);
        } else {
            // Ошибка на уровне настройки запроса
            console.error('Ошибка при настройке запроса:', error.message);
        }
        throw error;
    }
}
