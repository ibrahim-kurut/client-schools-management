import axios from "axios";
import { DOMAIN } from "./domain";
import { toast } from "react-toastify";
import { forceLogout } from "@/redux/slices/authSlice";

let store;

export const injectStore = (_store) => {
    store = _store;
};

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
            const retryAfter = error.response.data?.retryAfter || 60;
            const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
            
            // Check if we're on ANY login page (main /login or school /school/slug/login)
            const isOnLoginPage = currentPath === "/login" || currentPath.includes("/login");
            
            if (!isOnLoginPage) {
                // Not on login page -> Force logout and redirect
                if (store) {
                    store.dispatch(forceLogout());
                } else {
                    // Fallback cleanup
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("user");
                    }
                }
                
                // Redirect with reason and retryAfter tags
                if (typeof window !== "undefined") {
                    window.location.href = `/login?reason=rate-limit&retryAfter=${retryAfter}`;
                }
            } else {
                // Already on login page -> let the page's own error handler show inline alert
                // (No toast needed - handled by handleSubmit catch block)
            }
        } else if (status === 401 || status === 403) {
            toast.error("غير مصرح لك بالوصول، يرجى تسجيل الدخول مجدداً.");
        } else if (status === 400) {
            const message = error.response.data.message || "البيانات المدخلة غير صالحة، يرجى التحقق من الحقول.";
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
