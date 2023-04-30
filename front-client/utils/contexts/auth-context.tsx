import React, { createContext, useContext, useEffect, useState } from "react";
import { setCookie, parseCookies } from "nookies";

export interface UserType {
  id: string;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  tokenExpired: boolean;
  accessToken: string | null;
  refreshToken: string | null;

  setUser: (user: UserType | null) => void;
  setLoading: (loading: boolean) => void;
  setTokenExpired: (loading: boolean) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  tokenExpired: true,
  accessToken: null,
  refreshToken: null,

  setUser: () => {},
  setLoading: () => {},
  setTokenExpired: () => {},
  setAccessToken: () => {},
  setRefreshToken: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const { cookieAccessToken, cookieRefreshToken, cookieUser } = parseCookies();

  useEffect(() => {
    console.log(
      "cookieAccessToken, cookieRefreshToken, cookieUser",
      cookieAccessToken,
      cookieRefreshToken,
      cookieUser
    );
    if (cookieAccessToken) {
      setAccessToken(cookieAccessToken);
    }

    if (cookieRefreshToken) {
      setRefreshToken(cookieRefreshToken);
    }

    if (cookieUser) {
      setUser(JSON.parse(cookieUser));
    }
  }, []);

  useEffect(() => {
    console.log(
      "user, accessToken, refreshToken",
      user,
      accessToken,
      refreshToken
    );
    if (user) {
      setCookie(null, "user", JSON.stringify(user), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }

    if (accessToken) {
      setCookie(null, "accessToken", accessToken, {
        maxAge: 60 * 60,
        path: "/",
      });
    }

    if (refreshToken) {
      setCookie(null, "refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }
  }, [user, accessToken, refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        tokenExpired,
        accessToken,
        refreshToken,

        setUser,
        setLoading,
        setTokenExpired,
        setAccessToken,
        setRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useUser must be used within an AuthProvider");
  }

  return context;
};
