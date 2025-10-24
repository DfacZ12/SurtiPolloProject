import { useContext, createContext, useState, useEffect } from "react";
import type { AccesTokenResponse, AuthResponse } from "../interfaces/types";
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
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuth, setIsAuth] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {}, []);

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
    const token = localStorage.getItem("tk");
    if (token) {
      const { refreshToken } = JSON.parse(token);
      return refreshToken;
    }
    return null;
  };

  const saveUser = (userData: AuthResponse) => {
    setAccessToken(userData.body.accessToken);

    localStorage.setItem("tk", JSON.stringify(userData.body.refreshToken));

    setIsAuth(true);
  };



  const checkAuth = async () => {
    if (!accessToken) {
      const token = getRefreshToken();
      if (token) {
        const newAccessToken = await requestNewAccessToken(token);
        if (newAccessToken) {
          // setAccessToken(newAccessToken);
          // setIsAuth(true);
        }
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuth, getAccessToken, saveUser, getRefreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
