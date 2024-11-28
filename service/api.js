// src/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import endpoints from "./endpoints";
import { handleError } from "./error";
// import { API_BASE_URL } from "@env";
import { store } from "../redux/store"; // Import the Redux store
import { setAuth, clearAuth, setCurrentUser } from "../redux/authSlice";

// console.log("API_BASE_URL :>> ", API_BASE_URL);

export const BACKEND_API = axios.create({
  baseURL: "https://client-portal-api-staging.wealthvault.io/api",
  withCredentials: true,
});

// Clear existing auth data from AsyncStorage and Redux
const clearStoredAuthData = async () => {
  await AsyncStorage.removeItem("accessToken");
  store.dispatch(clearAuth());
};

// Axios Interceptor to add headers to each request
BACKEND_API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("accessToken"); // Always get token fresh from AsyncStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["device-info"] = "iPhone"; // Add device information header if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios Interceptor to handle responses
BACKEND_API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Handle token expiration or unauthorized errors
      await clearStoredAuthData();
      console.log("Token has expired. User logged out.");
    }
    return Promise.reject(error);
  }
);

// Function to store access token in AsyncStorage and Redux
const storeTokenAndAuthData = async (data) => {
  const { accessToken, expiresAt, refreshToken, method } = data.data;
    console.log("2FA Verification response data:", data.data);


  // Only store if accessToken exists and is valid
  if (accessToken) {
    console.log('valid accessToke :>> ', accessToken);
    await AsyncStorage.setItem("accessToken", accessToken); // Store token in AsyncStorage

    // Dispatch to Redux to set the auth data
    store.dispatch(
      setAuth({
        accessToken,
        expiryTime: expiresAt,
        refreshToken,
        method,
        // currentUser,
      })
    );
  } else {
    // Clear AsyncStorage if token is not provided
    await clearStoredAuthData();
    console.warn("Attempted to store an undefined access token.");
  }
};

// Login function to authenticate the user and set the access token
export const post_login = async (data) => {
  console.log("Logging in with:", data);

  // Clear existing auth data before a new login attempt
  await clearStoredAuthData();

  try {
    const response = await BACKEND_API.post(endpoints.post_login, {
      email: data.email,
      password: data.password,
    });

    console.log("Login response data:", response.data);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Error Status:", error.response.status);
      console.log("Error Data:", error.response.data);
    } else {
      console.log("Login error:", error);
    }
    handleError(error, "login");
  }
};

// Function to verify 2FA and set the access token
export const post_verify_login_2fa = async (token, type) => {
  try {
    const response = await BACKEND_API.post(endpoints.post_verify_login_2fa, {
      token,
      type,
    });
    const { accessToken, expiresAt, refreshToken, method } = response.data;
    // console.log("2FA Verification response data:", response.data);

    // Fetch and store user data after verification
    // await auth();
    await storeTokenAndAuthData(response.data);

    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Error Status:", error.response.status);
      console.log("Error Data:", error.response.data);
    } else {
      console.log("2FA Verification error:", error);
    }
    handleError(error, "verify_2fa_token");
  }
};

// Function to fetch authenticated user data
export const auth = async () => {
  try {
    const response = await BACKEND_API.get(endpoints.get_auth);
    const authData = response.data.data;

    // Update current user information in Redux
    store.dispatch(setCurrentUser(authData));

    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Error Status:", error.response.status);
      console.log("Error Data:", error.response.data);
    } else {
      console.log("Auth fetch error:", error);
    }
    handleError(error, "auth");
  }
};

// Function to log out the user and clear the access token
export const logout = async () => {
  try {
    await clearStoredAuthData(); // Clear token from AsyncStorage and Redux
    console.log("User logged out successfully.");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// Additional 2FA-related functions
export const post_send_2fa = async (type) => {
  console.log("Sending 2FA code for:", type);
  try {
    const response = await BACKEND_API.post(endpoints.post_send_2fa, { type });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Error Status:", error.response.status);
      console.log("Error Data:", error.response.data);
    } else {
      console.log("Send 2FA code error:", error);
    }
    handleError(error, "post_send_2fa");
  }
};

export const post_enable_2fa = async (type) => {
  try {
    const response = await BACKEND_API.post(endpoints.post_enable_2fa, { type });
    return response;
  } catch (error) {
    handleError(error, "post_enable_2fa");
  }
};

export const post_verify_2fa_token = async (token, type) => {
  try {
    const response = await BACKEND_API.post(endpoints.post_verify_2fa_token, { token, type });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Error Status:", error.response.status);
      console.log("Error Data:", error.response.data);
    } else {
      console.log("Verify 2FA token error:", error);
    }
    handleError(error, "verify_2fa_token");
  }
};
