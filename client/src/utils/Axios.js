import axios from "axios";
import summaryApi, { baseURL } from "../common/summaryApi";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

// Request Interceptor
Axios.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("accesstoken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
Axios.interceptors.response.use(
    (res) => {
        return res;
    },
    async (error) => {
        let originRequest = error.config;
        if (error.response?.status === 401 && !originRequest.retry) {
            originRequest.retry = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                const newAccessToken = await refreshAccessToken(refreshToken);

                if (newAccessToken) {
                    originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return Axios(originRequest); // Retry original request
                } else {
                    originRequest.retry = false; // Reset retry flag if refresh fails
                }
            }
        }

        return Promise.reject(error);
    }
);

const refreshAccessToken = async (refreshToken) => {
    try {
        const res = await Axios({
            ...summaryApi.refreshToken,
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        });

        const accessToken = res.data.data.accessToken;
        localStorage.setItem("accesstoken", accessToken);
        return accessToken;
    } catch (error) {
        console.error("Failed to refresh access token:", error);
        return null;
    }
};

export default Axios;
