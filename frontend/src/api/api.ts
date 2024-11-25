import axios, { AxiosError } from 'axios';
// import Cookies from 'js-cookie';


export const BASE_URL = 'http://localhost:8000/api';

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

// ____________________________________________________________________________________________________
// АДМИН ПАНЕЛЬ!

export async function getUserList() {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/detail_users_list/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
        });
        if (response.status !== 200) {
            throw new Error('Request failed');
        }
        return await response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export function deleteUser(id: number) {
    try {
        const token = localStorage.getItem("token");
        return axios.delete(`${BASE_URL}/delete_user/${id}/`, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') || '',
                'Authorization': `Token ${token}`,
            },
        });
    } catch (error) {
        console.error(error);
    }
}

export async function patchUser(id: number, isStaff: boolean, isSuperuser: boolean) {
    try {
        const token = localStorage.getItem("token");
        console.log(`смотрим id ${id}`);
        console.log(`смотрим isStaff ${isStaff}`);
        console.log(`смотрим isSuperuser ${isSuperuser}`);
        
        if (isStaff !== isSuperuser) {
            console.log(`ВЫЗВАЛСЯ ЭТОТ УЧАСТОК`);
            console.log(`смотрим isStaff ${isStaff}`);
            console.log(`смотрим isSuperuser ${isSuperuser}`);
            isSuperuser = isStaff;
            console.log(`_______________________________+++`);
            console.log(`смотрим isStaff ${isStaff}`);
            console.log(`смотрим isSuperuser ${isSuperuser}`);
        }
        console.log(`__________________________________`);
        return await axios.patch(`${BASE_URL}/auth/${id}/`, {
            is_staff: isStaff,
            is_superuser: isSuperuser,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') || '',
                'Authorization': `Token ${token}`,
            },
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// ____________________________________________________________________________________________________
// РАБОТА С ФАЙЛАМИ!

// запрос на получение файлов ВСЕХ пользователей
export async function getAllFiles() {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error('Token not found, please login. getAllFiles');
        }
        return axios.get(`${BASE_URL}/files/`, {
            headers: {
                'Content-Type': 'application/json',
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

// Добавление файла в БД и загрузка на сервер
export async function createFile(data: FormData) {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${BASE_URL}/files/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRFToken': getCookie('csrftoken') || '',
                'Authorization': `Token ${token}`,
            },
            withCredentials: true, // Включаем передачу кук
        });

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
            // Сервер вернул ответ с кодом ошибки
            console.error('Ошибка от сервера:', axiosError.response.data);
        } else if (axiosError.request) {
            // Запрос был отправлен, но ответа не было
            console.error('Ошибка запроса:', axiosError.request);
        } else {
            // Ошибка на уровне настройки запроса
            console.error('Ошибка при настройке запроса:', axiosError.message);
        }
        throw error;
    }
}

// Получение ссылок на загрузку файла
// export function downloadFile(id: number) {
//     try {
//         const token = localStorage.getItem("token");
//         return axios.get(`${BASE_URL}/link/${id}/`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Token ${token}`,
//             },
//         });
//     } catch (error) {
//         console.error('Error occurred during file download:', error);
//         throw error;
//     }
// }

export function getDownloadLink(id: number) {
    const token = localStorage.getItem("token");

    return axios.get(`${BASE_URL}/link/?file_id=${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });
}

// переименование файла и изменение коммента
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function patchFile(data: any, userStorageId: number | null = null) {
    const token = localStorage.getItem("token");

    const params = userStorageId ? `?user_storage_id=${userStorageId}` : '';
    const patchUrl = `${BASE_URL}/files/${data.id}/${params}`;

    console.log(`data: ${JSON.stringify(data, null, 2)}`)

    const payload = {
        comment: data.comment,
        file_name: data.file_name,
        user_id: data.user_id
    };

    return axios.patch(patchUrl, payload, {
        headers: {
            
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') || '',
            'Authorization': `Token ${token}`,
        },
    });
}

// Удаление файла
export function deleteFile(id: number, userStorageId: number | null = null) {
    const token = localStorage.getItem("token");

    // Формируем URL в стиле RESTful для DELETE-запроса
    const params = userStorageId ? `?user_storage_id=${userStorageId}` : '';
    const fullUrl = `${BASE_URL}/files/${id}/${params}`;
    console.log(`id файла: ${id}`);
    console.log(`params: ${params}`);
    console.log(`userStorageId: ${userStorageId}`);
    console.log(`Deleting file at: ${fullUrl}`);  // Логирование URL для отладки

    return axios.delete(fullUrl, {
        headers: {
            'X-CSRFToken': getCookie('csrftoken') || '',
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });
}