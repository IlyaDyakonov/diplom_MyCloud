import axios from 'axios';
// import Cookies from 'js-cookie';


const BASE_URL = 'http://localhost:8000/api';

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
        if (response.status === 201) {
            const token = await response.data;
            console.log('смотрим что в токене при регестрации:', token);
            // Сохраняем токен в localStorage или Redux
            if (token) {
                localStorage.setItem('token', token);
                console.log('Token saved:', token);
            } else {
                console.error('Token not found in response');
            }
            return response.data;
        }
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
        const data = await response.json();
        console.log('Ответ при логине:', data); // Проверяем, что приходит в ответе
        if (data.token) {
            // Сохраняем токен в localStorage
            localStorage.setItem('token', data.token);
            console.log('Токен сохранен:', data.token);
        } else {
            console.error('Токен не найден в ответе');
        }
        // Сохраняем токен в localStorage после успешной авторизации
        // localStorage.setItem('token', data.token);
        // console.log('смотрим что в дата:', data.token);
        return data;
        // return response.json();
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
            credentials: 'include', // Включаем передачу кук
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') || '',
                // cookie: `sessionid=${getCookie('sessionid')}`,
            },
            body: JSON.stringify({ username: username }),
        });

        if (!response.ok) {
            throw new Error('Ошибка при выходе');
        }
        // const data = await response.json();
        // Сохраняем токен в localStorage после успешной авторизации
        localStorage.removeItem('token');
        return response
    } catch (error) {
        console.error('Logout request failed:', error);
        throw error;
    }
}

// const getToken = () => {
//     return localStorage.getItem('token');  // Токен сохраняется в localStorage
// }

// запрос на получение файлов пользователей
export async function getAllFiles() {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error('Token not found, please login. getAllFiles');
        }
        // const token = getToken();
        return axios.get(`${BASE_URL}/files/`, {
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Token ${token}`,
                'Authorization': `Token ${token}`,
            },
        });
    } catch (error) {
    console.error('Error getting All files: ', error);
    throw error;
    }
}

// запрос на получение файлов определённого пользователя
export async function getUserFiles(user_id: number) {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error('Token not found, please login. getUserFiles');
        }
        return axios.get(`${BASE_URL}/files/?user_id=${user_id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
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
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') || '',
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
