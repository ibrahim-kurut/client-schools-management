import axios from "axios";
import { DOMAIN } from "./domain";

const axiosInstance = axios.create({
    baseURL: DOMAIN,
    withCredentials: true,
});

export default axiosInstance;
