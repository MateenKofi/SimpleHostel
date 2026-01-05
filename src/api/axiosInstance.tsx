import axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // Fallback to /api if env not set
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
        const { response } = error;

        if (response) {
            if (response.status === 401) {
                // Unauthorized - clear session and redirect to login
                localStorage.clear();
                window.location.href = "/login";
                toast.error("Session expired. Please log in again.");
            } else if (response.status === 403) {
                // Forbidden - permission issues
                toast.error("You don't have permission to perform this action.");
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
