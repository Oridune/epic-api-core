import axios from "axios";
import i18n from "i18next";

export { AxiosError, type AxiosResponse } from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  headers: {
    "X-Api-Version": import.meta.env.VITE_API_VERSION,
  },
});

API.interceptors.request.use((config) => {
  config.headers["Accept-Language"] ??= i18n.language;
  return config;
});

export default API;
