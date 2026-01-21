import axios, {type InternalAxiosRequestConfig, type AxiosError, type AxiosResponse} from "axios";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const devEnv = process.env.NEXT_PUBLIC_ENV === "development";
const BASE_URL = devEnv ? "http://localhost:5000" : process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/api/v1`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // Any status code within the range of 2xx triggers this function
        return response;
    },
    async (error: AxiosError) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't tried retrying yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
      if (isRefreshing) {
        // If a refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // calling refresh token endpoint
        await axiosInstance.post("/auth/refresh-token");
        
        isRefreshing = false;
        processQueue(null);

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        
        // If refresh fails, the refresh token is likely expired too
        console.error("Session expired. Please log in again.");
        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }
        return Promise.reject(refreshError);
      }
    }

    // Standard error handling
    const errorMessage = (error.response?.data as any)?.message || "Something went wrong";
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;