import axios from "axios";
import { DOMAIN } from "./domain";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: DOMAIN,
    withCredentials: true,
});

// Response interceptor to handle security errors and rate limiting
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response ? error.response.status : null;

        if (status === 429) {
            toast.error("لقد تجاوزت حد الطلبات المسموح به، يرجى الانتظار قليلاً.");
        } else if (status === 401 || status === 403) {
            toast.error("غير مصرح لك بالوصول، يرجى تسجيل الدخول مجدداً.");
        } else if (status === 400) {
            // Check if it's a validation error with a specific message
            const message = error.response.data.message || "البيانات المدخلة غير صالحة، يرجى التحقق من الحقول.";
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
