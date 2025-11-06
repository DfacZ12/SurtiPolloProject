import axios from "axios";
import { API_URL } from "./consts";
import { toast } from "react-hot-toast";

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      toast.error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.", {
        duration: 4000,
      });

      // Limpia tokens
      localStorage.removeItem("tk");

      // Pequeño delay para que el toast se muestre antes de redirigir
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
