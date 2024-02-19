import axios from "axios";
import { clearLocalStorgeData } from "./localStorage";

export const Axios  = () => {
    // * Create api for common
    const Api = axios.create({
        baseURL: import.meta.env.VITE_API + "api"
    });

    Api.interceptors.response.use(function (response) {
        return response;
      }, function (error) {
        if (error.response && error.response.status === 401) {
            clearLocalStorgeData()
            window.location.href = '/login';
        }
        return Promise.reject(error);
      });

    return Api
}