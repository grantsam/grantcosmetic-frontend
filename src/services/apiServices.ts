import axios from "axios";

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const isAxiosError = axios.isAxiosError;
export default apiClient;
