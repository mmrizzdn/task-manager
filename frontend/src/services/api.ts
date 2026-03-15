import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token!);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/login') &&
            !originalRequest.url?.includes('/auth/refresh-token')
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await api.post(
                    '/auth/refresh-token',
                    {},
                    { withCredentials: true }
                );

                const newToken = response.data.data.access_token;

                localStorage.setItem('token', newToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                processQueue(null, newToken);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        if (error.response?.data?.error?.message) {
            error.response.data.message = error.response.data.error.message;
        }

        return Promise.reject(error);
    },
);

export const authApi = {
    register: (data: { name: string; email: string; password: string; confirm_password: string }) =>
        api.post('/users', data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
    logout: () =>
        api.post('/auth/logout'),
    refresh: () =>
        api.post('/auth/refresh-token', {}, { withCredentials: true }),
};

export const tasksApi = {
    getMyTasks: (page = 1, limit = 10, sort = 'created_at', order = 'desc', status?: string, search?: string) => {
        return api.get('/tasks/my-tasks', {
            params: {
                page, limit, sort, order,
                ...(status ? { status } : {}),
                ...(search ? { search } : {}),
            },
        });
    },
    getMyTaskStats: () =>
        api.get('/tasks/my-stats'),
    getTasks: (page = 1, limit = 10, sort = 'created_at', order = 'desc', status?: string, search?: string) =>
        api.get('/tasks', {
            params: {
                page, limit, sort, order,
                ...(status ? { status } : {}),
                ...(search ? { search } : {}),
            },
        }),
    getTaskById: (id: string) =>
        api.get(`/tasks/${id}`),
    createTask: (data: { title: string; description?: string; is_completed?: boolean }) => {
        const validatedData = {
            ...data,
            is_completed: data.is_completed === true || data.is_completed === false 
                ? data.is_completed 
                : undefined,
        };
        return api.post('/tasks', validatedData);
    },
    updateTask: (id: string, data: { title?: string; description?: string; is_completed?: boolean }) => {
        const validatedData = {
            ...data,
            is_completed: data.is_completed === true || data.is_completed === false 
                ? data.is_completed 
                : undefined,
        };
        return api.put(`/tasks/${id}`, validatedData);
    },
    deleteTask: (id: string) =>
        api.delete(`/tasks/${id}`),
};

export const usersApi = {
    getUsers: (page = 1, limit = 10, sort = 'name', order = 'asc', search?: string) =>
        api.get('/users', {
            params: {
                page, limit, sort, order,
                ...(search ? { search } : {}),
            },
        }),
    getUserById: (id: string) =>
        api.get(`/users/${id}`),
    getUserTasks: (
        id: string,
        page = 1,
        limit = 10,
        sort = 'created_at',
        order = 'desc',
        status?: string,
        search?: string,
    ) =>
        api.get(`/users/${id}/tasks`, {
            params: {
                page, limit, sort, order,
                ...(status ? { status } : {}),
                ...(search ? { search } : {}),
            },
        }),
    getTasksByUserId: (
        id: string,
        page = 1,
        limit = 10,
        sort = 'created_at',
        order = 'desc',
        status?: string,
        search?: string,
    ) =>
        api.get(`/users/${id}/tasks`, {
            params: {
                page, limit, sort, order,
                ...(status ? { status } : {}),
                ...(search ? { search } : {}),
            },
        }),
    updateUser: (id: string, data: { name?: string; email?: string }) =>
        api.put(`/users/${id}`, data),
    deleteUser: (id: string) =>
        api.delete(`/users/${id}`),
};

export default api;