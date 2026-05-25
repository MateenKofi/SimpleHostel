import axios from "axios";
import { toast } from "sonner";

const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "/api";

const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
    (config) => {
        // Skip token attachment for auth endpoints (login, signup, password reset)
        // These endpoints authenticate via credentials, not existing tokens
        const isAuthEndpoint = config?.url?.includes('/login') ||
            config?.url?.includes('/signup') ||
            config?.url?.includes('/reset-password');

        if (!isAuthEndpoint) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 and 403 errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response, config } = error;

        if (response) {
            if (response.status === 401) {
                // Don't redirect if this is a login request (invalid credentials)
                const isLoginRequest = config?.url?.includes('/login');

                if (!isLoginRequest) {
                    // Unauthorized - clear session and redirect to login
                    localStorage.clear();
                    window.location.href = "/login";
                    toast.error("Session expired. Please log in again.");
                }
                // For login failures, let the component handle the error message
            } else if (response.status === 403) {
                // Forbidden - permission issues
                toast.error("You don't have permission to perform this action.");
            } else if (response.status === 429) {
                // Rate Limiting
                toast.error("Too many requests. Please try again later.");
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
