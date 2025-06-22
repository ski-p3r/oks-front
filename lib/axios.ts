// lib/axios.ts
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  withCredentials: true, // Optional: include if you're dealing with cookies
});

// Add Bearer token (if exists) to Authorization header
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handler
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      console.error(`API Error ${status}:`, error.response.data);

      if (status === 401) {
        const refreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem("refreshToken")
            : null;

        if (refreshToken) {
          // Attempt to refresh the token
          return axios
            .post(`${API_BASE_URL}/auth/token/refresh/`, { refreshToken })
            .then((response) => {
              const newToken = response.data.token;
              localStorage.setItem("token", newToken);

              // Retry the original request with the new token
              if (error.config && error.config.headers) {
                error.config.headers.Authorization = `Bearer ${newToken}`;
              }
              if (error.config) {
                return axiosInstance.request(error.config);
              }
              return Promise.reject(error);
            })
            .catch((refreshError) => {
              console.error("Failed to refresh token:", refreshError);
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              window.location.href = "/login"; // Redirect to login page
              return Promise.reject(refreshError);
            });
        } else {
          // No refresh token, redirect to login
          localStorage.removeItem("token");
          window.location.href = "/login"; // Redirect to login page
        }
      }
    } else if (error.request) {
      console.error("No response from server:", error.request);
    } else {
      console.error("Axios request error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
