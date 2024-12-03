// src/api/api.ts
import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

interface RefreshResponse {
    access: string;
}

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

const api = axios.create({
    baseURL: "http://silverpi.ddns.net:54321",
    withCredentials: true,
});

// Add authorization header to requests
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;
        
        if (
            error.response?.status === 401 && 
            originalRequest && 
            !originalRequest._retry
        ) {
            try {
                originalRequest._retry = true;
                
                const refreshToken = localStorage.getItem("refresh_token");
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                const { data } = await axios.post<RefreshResponse>(
                    `${api.defaults.baseURL}/token/refresh/`,
                    { refresh: refreshToken }
                );

                localStorage.setItem("access_token", data.access);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${data.access}`;
                }

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                
                if (typeof window !== 'undefined') {
                    window.location.href = "/";
                }
                
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;