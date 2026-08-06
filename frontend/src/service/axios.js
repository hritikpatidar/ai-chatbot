import axios from "axios";
import { getItemLocalStorage } from "../utils/browserServices";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = getItemLocalStorage("token");
  const lang = getItemLocalStorage("i18nextLng");
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
      lang: lang || "en",
    };
  }
  return config;
});

axiosInstance.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response) {
    console.log("Network error - make sure API is running!");
  }
  if (error.response) {
    const { status, data } = error.response;
    if (status === 404) {
      console.log("Not Found");
    }
    if (status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    if (data?.message === "jwt expired") {
      window.location.href = "/login";
      alert("Your session has expired, please login again")
    }
    return error.response;
  } else {
    console.log("error", error);
    return error;
  }
});

export default axiosInstance;
