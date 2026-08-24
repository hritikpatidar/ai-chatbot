import axios from "axios";
import {
  getItemLocalStorage,
  setItemLocalStorage,
  removeItemLocalStorage,
} from "../utils/browserServices";
import { updateReduxAccessToken } from "../redux/authToken";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* =========================================================
   MAIN AXIOS INSTANCE
========================================================= */

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

/* =========================================================
   REFRESH TOKEN AXIOS INSTANCE
   Isko main axiosInstance se separate rakha hai,
   taaki refresh API 401 hone par interceptor loop na bane.
========================================================= */

const refreshAxios = axios.create({
  baseURL: API_BASE_URL,
});

/* =========================================================
   REFRESH STATE
========================================================= */

let isRefreshing = false;

let failedQueue = [];

/* =========================================================
   PROCESS FAILED REQUEST QUEUE
========================================================= */

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

/* =========================================================
   REQUEST INTERCEPTOR
========================================================= */

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getItemLocalStorage("token");
    const lang = getItemLocalStorage("i18nextLng");

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
        lang: lang || "en",
      };
    } else {
      config.headers = {
        ...config.headers,
        lang: lang || "en",
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    /* =====================================================
       NETWORK ERROR
    ===================================================== */

    if (error.message === "Network Error" && !error.response) {
      console.log("Network error - make sure API is running!");

      return Promise.reject(error);
    }

    /* =====================================================
       NO RESPONSE
    ===================================================== */
    console.log("error", error);
    if (!error.response) {
      console.log("error", error);

      return Promise.reject(error);
    }

    const { status, data } = error.response;

    /* =====================================================
       404
    ===================================================== */

    if (status === 404) {
      console.log("Not Found");
    }
    if (status === 400) {
      console.log("Bad Request:", status);
      return Promise.resolve(error.response);
    }

    /* =====================================================
       ONLY HANDLE 401
    ===================================================== */

    if (status !== 401) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    /* =====================================================
       REFRESH API KHUD 401 DE RAHI HAI
       Infinite loop prevent
    ===================================================== */

    if (originalRequest?.url?.includes("/auth/refresh-token")) {
      handleRefreshFailure();

      return Promise.reject(error);
    }

    /* =====================================================
       REQUEST ALREADY RETRIED
    ===================================================== */

    if (originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /* =====================================================
       CHECK REFRESH TOKEN
    ===================================================== */

    const refreshToken = getItemLocalStorage("refreshToken");

    if (!refreshToken) {
      handleRefreshFailure();

      return Promise.reject(error);
    }

    /* =====================================================
       IF REFRESH ALREADY RUNNING
       
       Current request queue me chali jayegi.
    ===================================================== */

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      })
        .then((newToken) => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };

          return axiosInstance(originalRequest);
        })
        .catch((refreshError) => {
          return Promise.reject(refreshError);
        });
    }

    /* =====================================================
       START REFRESH
    ===================================================== */

    isRefreshing = true;

    try {
      const refreshResponse = await refreshAxios.post("/auth/refresh-token", {
        refreshToken,
      });

      const newAccessToken = refreshResponse?.data?.data?.accessToken;

      if (!newAccessToken) {
        throw new Error("New access token was not returned");
      }

      /* =========================================
     UPDATE LOCAL STORAGE
  ========================================= */

      setItemLocalStorage("token", newAccessToken);

      /* =========================================
     UPDATE REDUX
  ========================================= */

      updateReduxAccessToken(newAccessToken);
      /* =========================================
     WAITING REQUESTS
  ========================================= */

      processQueue(null, newAccessToken);

      /* =========================================
     ORIGINAL REQUEST
  ========================================= */

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      handleRefreshFailure();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

/* =========================================================
   REFRESH FAILURE
========================================================= */

const handleRefreshFailure = () => {
  removeItemLocalStorage("token");
  removeItemLocalStorage("refreshToken");

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

/* =========================================================
   EXPORT
========================================================= */

export default axiosInstance;
