// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { FileType } from '../frontend/src/models';


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
const baseQuery = fetchBaseQuery({
    baseUrl: '/api', // Указываем базовый URL для API запросов
    credentials: 'include',
    prepareHeaders: (headers) => {
        const csrfToken = getCookie('csrftoken');
        if (csrfToken) {
            headers.set('X-CSRFToken', csrfToken); // Добавляем CSRF-токен в заголовки
        }
        return headers;
    },
});

// RTK Query API для пользователя
export const userApi = createApi({
    reducerPath: 'userQuery',
    baseQuery,
    endpoints: (builder) => ({
        // логин пользователя
        loginAction: builder.mutation({
            query: (credentials) => ({
                url: '/login/',
                method: 'POST',
                body: JSON.stringify(credentials), // Данные для авторизации (логин/пароль)
            })
        }),
        // логаут пользователя
        logoutAction: builder.mutation({
            query: () => ({
                url: '/logout/',
                method: 'POST', // Для логаута используется POST запрос
            }),
        }),
        // регистрация пользователя
        createUser: builder.mutation({
            query: (userData) => ({
                url: '/register/',
                method: 'POST',
                body: userData, // Данные для регистрации (логин, email, пароль)
            }),
        }),
    })
})

export const fileApi = createApi({
    reducerPath: 'fileQuery',
    baseQuery,
    tagTypes: ['File'],
    endpoints: (builder) => ({
        getFiles: builder.query<FileType[], string>({
            query: (userFolder) => `/files/${userFolder}/`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'File' as const, id })),
                        { type: 'File' as const, id: 'LIST' },
                    ]
                    : [{ type: 'File' as const, id: 'LIST' }]
        }),
        downloadFile: builder.mutation({
            query: (uniqueId) => `download/${uniqueId}`,
            invalidatesTags: [{ type: 'File', id: 'LIST' }],
        }),
        uploadFile: builder.mutation({
            query: (data) => ({
                url: `/files/${data.get('folder_name')}/`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'File', id: 'LIST' }],
        }),
        updateFile: builder.mutation({
            query: (data) => ({
                url: `/files/${data.folder_name}/${data.id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ({ id }) => [{ type: 'File', id }],
        }),
        deleteFile: builder.mutation({
            query: (data) => ({
                url: `/files/${data.folder_name}/${data.id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (response, error, { id }) => {
                if (error || !response) {
                    console.error('Ошибка при удалении файла или неожиданный формат ответа:', response, error);
                    return [];
                }
                return [{ type: 'File', id: id ?? response?.data?.id }];
            },
        }),
    })
})

export const {
    useLoginActionMutation,
    useLogoutActionMutation,
    useCreateUserMutation,
} = userApi;

export const {
    useGetFilesQuery,
    useDownloadFileMutation,
    useUploadFileMutation,
    useUpdateFileMutation,
    useDeleteFileMutation,
} = fileApi;