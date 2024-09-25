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

export async function getFiles() {
    try {
        return axios.get(`${BASE_URL}/files/{folder_name}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
    console.error(error);
    throw error;
    }
}

