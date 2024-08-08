import axios from 'axios';
import { toast } from 'react-hot-toast';

const Api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

const ApiJson = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

const config = {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
};

// Add interceptor for handling token expiration
Api.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401 && error.response.data.message === "Token expired") {
            localStorage.removeItem('token');
            window.location.href = '/login';
            toast.error("Session expired. Please login again.");
        }
        return Promise.reject(error);
    }
);

ApiJson.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401 && error.response.data.message === "Token expired") {
            localStorage.removeItem('token');
            window.location.href = '/login';
            toast.error("Session expired. Please login again.");
        }
        return Promise.reject(error);
    }
);

export const loginApi = (data) => ApiJson.post('/api/users/login', data);
export const registerApi = (data) => ApiJson.post('/api/users/register', data);
export const uploadFileApi = (data, options) => Api.post('/api/files/upload', data, {
    ...config,
    ...options,
});
