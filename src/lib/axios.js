import axios from "axios";
import { DOMAIN } from "./domain";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: DOMAIN,
    withCredentials: true,
});

// Response interceptor to handle rate limiting and common errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // If it's a 429, we let the components handle it to show specific timers/messages
        return Promise.reject(error);
    }
);

export default axiosInstance;
