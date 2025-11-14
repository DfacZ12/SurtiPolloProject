import axios from "axios";
import { API_URL } from "./Consts";
import { toast } from "react-hot-toast";

const AxiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

AxiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      toast.error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.", {
        duration: 4000,
      });

      // Limpia almacenamiento local
      localStorage.clear();

      // Pequeño delay para que el toast se muestre antes de redirigir
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }

    return Promise.reject(error);
  }
);

export default AxiosClient;
