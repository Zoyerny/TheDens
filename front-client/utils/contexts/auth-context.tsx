import React, { createContext, useContext, useEffect, useState } from "react";
import { setCookie, parseCookies } from "nookies";

export interface UserType {
  id: string;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  tokenExpired: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
  tokenExpired: false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenExpired, setTokenExpired] = useState(false);

  const cookies = parseCookies();
  const accessToken = cookies.accessToken;
  const refreshToken = cookies.refreshToken;
  const userString = cookies.user;

  useEffect(() => {
    if (accessToken) {
      if (userString) {
        setUser(JSON.parse(userString));
        setLoading(false); // Ajoutez cette ligne
      } else {
        setTokenExpired(true);
      }
    } else {
      setTokenExpired(true);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userString]);

  useEffect(() => {
    if (accessToken) {
      setCookie(null, "accessToken", accessToken, {
        maxAge: 60 * 60,
        path: "/",
      });

      if (refreshToken) {
        setCookie(null, "refreshToken", refreshToken, {
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });
      }
    }
  }, [accessToken, refreshToken]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, setLoading, tokenExpired }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useUser must be used within an AuthProvider");
  }

  return context;
};
