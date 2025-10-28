import { useContext, createContext, useState, useEffect } from "react";
import type {
  AccesTokenResponse,
  AuthResponse,
  User,
} from "../interfaces/types";
import axiosClient from "./axiosClient";
import { toast } from "react-hot-toast";
import { API_URL } from "./consts";
import { jwtDecode } from "jwt-decode";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface DecodedToken {
  exp: number;
  iat: number;
  [key: string]: unknown;
}

const AuthContext = createContext({
  isAuth: false,
  getAccessToken: () => {},
  saveUser: (userData: AuthResponse) => {},
  getRefreshToken: () => {},
  getUser: () => ({} as User | undefined),
  isLoading: true,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuth, setIsAuth] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const now = Date.now() / 1000; // segundos
      return decoded.exp < now;
    } catch {
      return true; // si falla el decode, asumimos que no es válido
    }
  };

  const requestNewAccessToken = async (refreshToken: string) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${refreshToken}` },
      };
      const response = await axiosClient.post(`${API_URL}/refresh-token`,{},config);
      if (response.status === 201) {
        const json = response.data as AccesTokenResponse;
        return json.body.accessToken;
      }
    } catch (error: unknown) {
      console.error("Error renovando el token:", error);
      tokenExpiredAction("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
    }
  };

  const getAccessToken = () => accessToken;

  const getRefreshToken = (): string | null => {
    const tokenData = localStorage.getItem("tk");
    return tokenData ? JSON.parse(tokenData) : null;
  };

  const saveUser = (userData: AuthResponse) => {
    saveSessionInfo(
      userData.body.infoUser,
      userData.body.accessToken,
      userData.body.refreshToken
    );
  };

  const saveSessionInfo = (
    userInfo: User,
    newAccessToken: string,
    refreshToken: string
  ) => {
    setAccessToken(accessToken);
    localStorage.setItem("tk", JSON.stringify(refreshToken));
    setUser(userInfo);
    setIsAuth(true);
    scheduleTokenRefresh(newAccessToken, refreshToken);
  };

  const scheduleTokenRefresh = (token: string, refreshToken: string) => {
    try {
      const decoded = safeDecode(token);
      if (!decoded) return true;
      const expiresInMs = decoded.exp * 1000 - Date.now() - 60_000;
      if (expiresInMs > 0) {
        setTimeout(async () => {
          console.log("Renovando token antes de que expire...");
          const newToken = await requestNewAccessToken(refreshToken);
          if (newToken) {
            const userInfo = await getUserInfo(newToken);
            if (userInfo) saveSessionInfo(userInfo, newToken, refreshToken);
          }
        }, expiresInMs);
      }
    } catch (err) {
      console.warn("No se pudo programar el refresh automático:", err);
    }
  };

  const safeDecode = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};

  const checkAuth = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }
      const newAccessToken = await requestNewAccessToken(refreshToken);
      if (!newAccessToken) {
        tokenExpiredAction("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        return;
      }
      if (isTokenExpired(newAccessToken)) {
          tokenExpiredAction("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          return;
      }
      const userInfo = await getUserInfo(newAccessToken);
      if (!userInfo) {
        toast.error("Error al recuperar la información del usuario.");
        setIsLoading(false);
        return;
      }
      saveSessionInfo(userInfo, newAccessToken, refreshToken);
    } catch (error) {
      console.error("Error durante checkAuth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const tokenExpiredAction = (toastMsg: string): void => {
    toast.error(toastMsg);
    localStorage.removeItem("tk");
    setIsAuth(false);
    setUser(undefined);
    setIsLoading(false);
    setTimeout(() => {
      window.location.href = "/"; // redirige al login
    }, 1500);
  };

  const getUserInfo = async (accessToken: string) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const response = await axiosClient.get(
        `${API_URL}/userInfoToken`,
        config
      );
      if (response.status === 201) {
        return response.data.body;
      }
    } catch (error) {
      console.error("Error obteniendo info del usuario:", error);
    }
  };

  const getUser = (): User | undefined => user;

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        getAccessToken,
        saveUser,
        getRefreshToken,
        getUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
