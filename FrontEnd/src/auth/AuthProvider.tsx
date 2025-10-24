import { useContext, createContext, useState, useEffect } from "react";
import type {
  AccesTokenResponse,
  AuthResponse,
  User,
} from "../interfaces/types";
import axios from "axios";
import { API_URL } from "./consts";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext({
  isAuth: false,
  getAccessToken: () => {},
  saveUser: (userData: AuthResponse) => {},
  getRefreshToken: () => {},
  getUser: () => ({} as User | undefined),
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuth, setIsAuth] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [user, setUser] = useState<User>();

  useEffect(() => {
    checkAuth();
  }, []);

  const requestNewAccessToken = async (refreshToken: string) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${refreshToken}` },
      };
      const response = await axios.post(`${API_URL}/refresh-token`, {}, config);
      if (response.status === 201) {
        const json = response.data as AccesTokenResponse;
        return json.body.accessToken;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(
          "Axios error RefreshToken:",
          error.response?.data.body.error || error.message
        );
        const json = await error.response?.data;
        throw new Error(json.body.error || error.message);
      }
    }
  };

  const getAccessToken = () => accessToken;

  const getRefreshToken = (): string | null => {
    const tokenData = localStorage.getItem("tk");
    if (tokenData) {
      const token = JSON.parse(tokenData);
      return token;
    }
    return null;
  };

  const saveUser = (userData: AuthResponse) => {
    saveSessionInfo(
      userData.body.infoUser,
      userData.body.accessToken,
      userData.body.refreshToken
    );
    console.log("User saved:", userData.body.infoUser);
  };

  const checkAuth = async () => {
    if (!accessToken) {
      const token = getRefreshToken();
      if (token) {
        const newAccessToken = await requestNewAccessToken(token);
        if (newAccessToken) {
          const userInfo = await getUserInfo(newAccessToken);
          if (userInfo) {
            console.log("User info retrieved on auth check:", userInfo);
            saveSessionInfo(userInfo, newAccessToken, token);
          }
        }
      }
    }
  };

  const getUserInfo = async (accessToken: string) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const response = await axios.get(`${API_URL}/userInfoToken`, config);
      if (response.status === 201) {
        const json = await response.data;
        console.log("UserInfo body:", json.body);

        return json.body;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(
          "Axios error UserInfo:",
          error.response?.data.body.error || error.message
        );
        const json = await error.response?.data;
        throw new Error(json.body.error || error.message);
      }
    }
  };

  const saveSessionInfo = (
    userInfo: User,
    accessToken: string,
    refreshToken: string
  ) => {
    setAccessToken(accessToken);
    localStorage.setItem("tk", JSON.stringify(refreshToken));
    setUser(userInfo);
    setIsAuth(true);
    console.log(userInfo);
    console.log("a",accessToken);
    console.log("r",refreshToken);
  };

  const getUser = () => user;

  return (
    <AuthContext.Provider
      value={{ isAuth, getAccessToken, saveUser, getRefreshToken, getUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
