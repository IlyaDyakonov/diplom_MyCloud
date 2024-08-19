/* eslint-disable no-useless-catch */
export const loginUser = async (username: string, password: string): Promise<any> => {
    const csrfToken = getCookie('csrftoken'); // Получаем CSRF токен

    // Создаем объект заголовков
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken
    }

    try {
        const response = await fetch('/api/login/', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Ошибка при логине');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

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
