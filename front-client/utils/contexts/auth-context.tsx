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
  accessToken: string | null;
  refreshToken: string | null;

  setUser: (user: UserType | null) => void;
  setLoading: (loading: boolean) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  accessToken: null,
  refreshToken: null,

  setUser: () => {},
  setLoading: () => {},
  setAccessToken: () => {},
  setRefreshToken: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const { cookieAccessToken, cookieRefreshToken, cookieUser } = parseCookies();

  useEffect(() => {
    /*console.log(
      "cookieAccessToken, cookieRefreshToken, cookieUser",
      cookieAccessToken,
      cookieRefreshToken,
      cookieUser
    );*/
    if (cookieAccessToken) {
      setAccessToken(cookieAccessToken);
    }

    if (cookieRefreshToken) {
      setRefreshToken(cookieRefreshToken);
    }

    if (cookieUser) {
      setUser(JSON.parse(cookieUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    /*console.log(
      "user, accessToken, refreshToken",
      user,
      accessToken,
      refreshToken
    );*/

    if (user) {
      setCookie(null, "cookieUser", JSON.stringify(user), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }

    if (accessToken) {
      setCookie(null, "cookieAccessToken", accessToken, {
        maxAge: 60 * 60,
        path: "/",
      });
    }

    if (refreshToken) {
      setCookie(null, "cookieRefreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }
  }, [user, accessToken, refreshToken]);

  if (loading){
    return <p>Loading...</p>
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accessToken,
        refreshToken,

        setUser,
        setLoading,
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
