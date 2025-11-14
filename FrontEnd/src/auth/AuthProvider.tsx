import { useContext, createContext, useState, useEffect } from "react";
import type {
  AccesTokenResponse,
  AuthResponse,
  User,
} from "../interfaces/types";
import AxiosClient from "./AxiosClient";
import { toast } from "react-hot-toast";
import { API_URL } from "./Consts";
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
  firstLogin: false,
  getAccessToken: () => {},
  saveUser: (_userData: AuthResponse) => {},
  getRefreshToken: () => {},
  getUser: () => ({} as User | undefined),
  isLoading: true,
  logOut: () => {},
  saveFirstLogin: (_firstLogin: boolean, _accessToken: string, _user: User, _refreshToken: string) => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuth, setIsAuth] = useState(false);
  const [firstLogin, setFirstLogin] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  let isRefreshing = false;
  let refreshPromise: Promise<{
    accessToken: string;
    refreshToken: string;
  } | null> | null = null;

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (isRefreshing && refreshPromise) return refreshPromise;
    isRefreshing = true;

    refreshPromise = (async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${refreshToken}` },
        };
        const response = await AxiosClient.post(
          `${API_URL}/refreshToken`,
          {},
          config
        );

        if (response.status === 201) {
          const json = response.data as AccesTokenResponse;
          const { accessToken, refreshToken: newRefreshToken } = json.body;
          localStorage.setItem("tk", JSON.stringify(newRefreshToken));
          return { accessToken, refreshToken: newRefreshToken };
        }
        return null;
      } catch (error) {
        return null;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    return refreshPromise;
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

  const saveFirstLogin = (firstLogin: boolean, accessToken: string, user: User, refreshToken: string) => {
    setAccessToken(accessToken);
    localStorage.setItem("tk", JSON.stringify(refreshToken));
    setIsAuth(true);
    setFirstLogin(firstLogin);
    setUser(user);
  };

  const saveSessionInfo = (
    userInfo: User,
    newAccessToken: string,
    refreshToken: string
  ) => {
    setAccessToken(newAccessToken);
    localStorage.setItem("tk", JSON.stringify(refreshToken));
    setUser(userInfo);
    setIsAuth(true);
    scheduleTokenRefresh(newAccessToken, refreshToken);
  };

  let refreshTimeout: ReturnType<typeof setTimeout> | null = null;
  let accessTimeout: ReturnType<typeof setTimeout> | null = null;

  const scheduleTokenRefresh = (accessToken: string, refreshToken: string) => {
    try {
      const decodedAccess = safeDecode(accessToken);
      const decodedRefresh = safeDecode(refreshToken);
      if (!decodedAccess || !decodedRefresh) return;

      const accessExpiresInMs = decodedAccess.exp * 1000 - Date.now() - 60_000;
      const refreshExpiresInMs = decodedRefresh.exp * 1000 - Date.now();

      // Limpia timeouts anteriores (evita duplicaciones)
      if (accessTimeout) clearTimeout(accessTimeout);
      if (refreshTimeout) clearTimeout(refreshTimeout);

      //Programar renovación del access token
      if (accessExpiresInMs > 0) {
        accessTimeout = setTimeout(async () => {
          const newTokens = await requestNewAccessToken(refreshToken);
          if (!newTokens) {
            tokenExpiredAction(
              "Tu sesión ha expirado. Inicia sesión nuevamente."
            );
            return;
          }
          const userInfo = await getUserInfo(newTokens.accessToken);
          if (userInfo) {
            saveSessionInfo(
              userInfo,
              newTokens.accessToken,
              newTokens.refreshToken
            );
          }
        }, accessExpiresInMs);
      }

      //Programar cierre de sesión cuando expire el refresh token
      if (refreshExpiresInMs > 0) {
        refreshTimeout = setTimeout(() => {
          tokenExpiredAction(
            "Tu sesión ha expirado. Inicia sesión nuevamente."
          );
        }, refreshExpiresInMs);
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
      const oldRefreshToken = getRefreshToken();
      if (!oldRefreshToken) {
        setIsLoading(false);
        return;
      }
      const tokenPair = await requestNewAccessToken(oldRefreshToken);
      if (!tokenPair) {
        tokenExpiredAction(
          "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
        );
        return;
      }
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        tokenPair;
      if (isTokenExpired(newAccessToken)) {
        tokenExpiredAction(
          "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
        );
        return;
      }
      const userInfo = await getUserInfo(newAccessToken);
      if (!userInfo) {
        toast.error("Error al recuperar la información del usuario.");
        setIsLoading(false);
        return;
      }
      saveSessionInfo(userInfo, newAccessToken, newRefreshToken);
    } catch (error) {
      console.error("Error durante checkAuth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const tokenExpiredAction = (toastMsg: string): void => {
    toast.error(toastMsg);
    localStorage.clear();
    setIsAuth(false);
    setUser(undefined);
    setIsLoading(false);
    setFirstLogin(false);
  };

  const getUserInfo = async (accessToken: string) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const response = await AxiosClient.get(
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

  const logOut = () => {
    setIsAuth(false);
    setAccessToken("");
    setUser(undefined);
    setFirstLogin(false);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        firstLogin,
        getAccessToken,
        saveUser,
        getRefreshToken,
        getUser,
        isLoading,
        logOut,
        saveFirstLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
