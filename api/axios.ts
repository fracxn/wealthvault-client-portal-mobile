import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { baseReducer } from "../store";
import { formatLog } from "../lib/utils";
import * as Device from "expo-device";



export const getAxiosInstance = () => {
    const axiosInstance = axios.create();
    const { accessToken, setReset } = baseReducer.getState();

    axiosInstance.defaults.baseURL =  "https://client-portal-api-staging.wealthvault.io/api";
    axiosInstance.defaults.withCredentials =true
 
    // axiosInstance.defaults.baseURL =
    //   process.env.EXPO_PUBLIC_BASE_URL + "/api/v1/";


    if (accessToken) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
    axiosInstance.interceptors.request.use(async (config) => {
        // Add device info to the request headers
        // const deviceInfo = {
        //     brand: Device.brand || "Unknown Brand",
        //     manufacturer: Device.manufacturer || "Unknown Manufacturer",
        //     model: Device.modelName || "Unknown Model",
        //     osName: Device.osName || "Unknown OS",
        //     osVersion: Device.osVersion || "Unknown Version",
        //     deviceId: Device.deviceId || "Unknown Device ID",
        // };

        // Attach device info as a custom header
        config.headers["Device-Info"] = Device.osName || "Unknown OS" ;

        return config;
    });

    axiosInstance.interceptors.response.use(
        (res) => {
            
            res.headers["device-info"] = "iPhone";
            return res
        },
        async (error: AxiosError) => {
            const isUnauthorized = error.response && error.response.status === 403;
            if (isUnauthorized) {
                // Redirect out to Login screen
                setReset();
            }

            return Promise.reject(error);
        }
    );

    axiosInstance.defaults.headers.common["Content-Type"] = "application/json";
    axiosInstance.defaults.headers.common["Accept"] = "application/json";

    axiosInstance.defaults.withCredentials = true;

    return axiosInstance;
};

export const getRequest = async (url: string) => {
    console.log(url)
    const res = await getAxiosInstance().get(`${url}`);
    return res;
};

export const postRequest = async <T extends unknown = unknown>(
    url: string,
    payload: T,
    config?: AxiosRequestConfig
) => {
    // formatLog(payload);
    console.log("paload", payload)
    const res = await getAxiosInstance().post(url, payload, config);
    return res;
};

export const patchRequest = async <T extends unknown = unknown>(
    url: string,
    payload: T,
    config?: AxiosRequestConfig
) => {
    const res = await getAxiosInstance().patch(`${url}`, payload, config);
    return res;
};

export const putRequest = async <T extends unknown = unknown>(
    url: string,
    payload: T,
    config?: AxiosRequestConfig
) => {
    formatLog(payload);
    const res = await getAxiosInstance().put(`${url}`, payload, config);
    return res;
};

export const deleteRequest = async <T extends unknown = unknown>(
    url: string,
    payload: T
) => {
    const res = await getAxiosInstance().delete(`${url}`, { data: payload });
    return res;
};
