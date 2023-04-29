import React, { createContext, useContext, useEffect, useState } from "react";
import { setCookie, parseCookies } from "nookies";
import { REFRESH_TOKENS_MUTATION } from "@/graphql/refreshTokens.mutation";
import { useMutation } from "@apollo/client";
import { contextEventEmitter } from "../socketToContext/event-emitter";
import { AuthContextEventId } from "../socketToContext/event.enums";
import { useSocket } from "./socket-context";
import { ClientToServerId } from "../socket/socket.enums";
import { SendSocket } from "../socket/send-socket";

export interface UserType {
  id: string;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  tokenExpired: boolean;
  setTokenExpired: (loading: boolean) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string | null) => void;
  isUserInitialized: boolean;
  needTokenChange: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
  tokenExpired: true,
  setTokenExpired: () => {},
  accessToken: null,
  setAccessToken: () => {},
  refreshToken: null,
  setRefreshToken: () => {},
  isUserInitialized: false,
  needTokenChange: false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [isUserInitialized, setIsUserInitialized] = useState<boolean>(false);
  const [needTokenChange, setNeedTokenChange] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const { socket, setNeedChangeSocket } = useSocket();

  const [sendCache, setSendCache] = useState<{
    clientToServerId: ClientToServerId;
    message?: any;
  } | null>(null);

  const cookies = parseCookies();
  const firstAccesToken = cookies.accessToken;
  const firstRefreshToken = cookies.refreshToken;
  const userString = cookies.user;

  const [refreshTokensMutation, { error: refreshTokensError }] = useMutation(
    REFRESH_TOKENS_MUTATION
  );

  const undefinedCookies = () => {
    setCookie(null, "user", "", {
      maxAge: 0,
      path: "/",
      //secure: true,
      //httpOnly: true,
    });

    setCookie(null, "accessToken", "", {
      maxAge: 0,
      path: "/",
      //secure: true,
      //httpOnly: true,
    });

    setCookie(null, "refreshToken", "", {
      maxAge: 0,
      path: "/",
      //secure: true,
      //httpOnly: true,
    });
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString("utf-8")
      );
      return payload.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    setAccessToken(firstAccesToken);
    setRefreshToken(firstRefreshToken);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (refreshTokensError) {
      console.error(refreshTokensError);
    }
  }, [refreshTokensError]);

  useEffect(() => {
    console.log("--------------------------------------");
    if (userString) {
      if (firstRefreshToken) {
        if (!isTokenExpired(firstRefreshToken)) {
          if (firstAccesToken) {
            console.log("le accessToken existe");
            if (!isTokenExpired(firstAccesToken)) {
              console.log("le accessToken existe et il n'est pas expiré");
              setTokenExpired(false);
              setAccessToken(firstAccesToken);
            } else {
              console.log("le accessToken existe mais il est expiré");
              setTokenExpired(false);
              setNeedTokenChange(true);
            }
          }
          console.log("le refreshToken existe et il n'est pas expiré");
          setUser(JSON.parse(userString));
          setRefreshToken(firstRefreshToken);
        } else {
          console.log("le refreshToken existe mais expiré");
          setTokenExpired(true);
        }
        console.log("le refreshToken existe");
      } else {
        setTokenExpired(true);
      }
      console.log("l'utilisateur existe");
    } else {
      console.log("aucun utilisateur existe");
      setUser(null);
      setTokenExpired(true);
      undefinedCookies();
      setAccessToken(null);
      setRefreshToken(null);
    }
    setLoading(false);
    setIsUserInitialized(true);
    console.log("--------------------------------------");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userString, firstAccesToken, firstRefreshToken]);

  useEffect(() => {
    if (user) {
      const userString = JSON.stringify(user);

      setCookie(null, "user", userString, {
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
        //secure: true,
        //httpOnly: true,
      });
    }
  }, [user]);

  useEffect(() => {
    if (accessToken) {
      setCookie(null, "accessToken", accessToken, {
        maxAge: 60 * 60,
        path: "/",
        //secure: true,
        //httpOnly: true,
      });

      if (refreshToken) {
        setCookie(null, "refreshToken", refreshToken, {
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
          //secure: true,
          //httpOnly: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, refreshToken]);

  useEffect(() => {
    if (isUserInitialized) {
      if (sendCache && !needTokenChange) {
        if (socket?.getSocket()) {
          const { clientToServerId, message } = sendCache;
          const messageRetry = new SendSocket(socket.getSocket()!);
          messageRetry.send(clientToServerId, message);
          setSendCache(null);
        } else {
          console.log(
            "probleme l'or du renvoie de la donné socket = ",
            socket?.getSocket()
          );
          setSendCache(null);
        }
      }
    }
  }, [needTokenChange, sendCache, socket, isUserInitialized]);

  useEffect(() => {
    console.log("Information Utilisateur :");
    console.log("isUserInitialized", isUserInitialized);
    console.log("user", user);
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);
    console.log("tokenExpired", tokenExpired);
    console.log("needTokenChange", needTokenChange);
  }, [
    user,
    accessToken,
    refreshToken,
    isUserInitialized,
    tokenExpired,
    needTokenChange,
  ]);

  useEffect(() => {
    if (needTokenChange && user && !isTokenExpired(refreshToken!)) {
      refreshTokensMutation({ variables: { refreshToken } })
        .then(({ data }) => {
          console.log("YOOOOLLLOOOOOO");
          setAccessToken(data.getNewTokens.accessToken);
          setRefreshToken(data.getNewTokens.refreshToken);
          setNeedTokenChange(false);
          setIsUserInitialized(true);
          console.log("Token Has Been Refreshed");
          setNeedChangeSocket(true);
        })
        .catch((error) => {
          console.log("Token Refreshed Error : ", error);
          undefinedCookies();
          setUser(null);
          setTokenExpired(true);
          setNeedChangeSocket(false);
        });
    }
  }, [
    user,
    needTokenChange,
    isUserInitialized,
    refreshToken,
    refreshTokensMutation,
    setNeedChangeSocket,
  ]);

  useEffect(() => {
    const handleSetTokenExpired = (data: {
      clientToServerId: ClientToServerId;
      message?: any;
    }) => {
      if (isTokenExpired(accessToken!) && !isTokenExpired(refreshToken!)) {
        setNeedTokenChange(true);
        setSendCache(data);
      } else if (
        isTokenExpired(accessToken!) &&
        isTokenExpired(refreshToken!)
      ) {
        undefinedCookies();
        setUser(null);
        setTokenExpired(true);
        console.log("Session expiré");
      } else {
        console.error(
          "debug : pas besoin de refresh le token keske tu fais ici ?"
        );
      }
    };

    contextEventEmitter.on(
      AuthContextEventId.CHECK_TOKEN_STATUS,
      handleSetTokenExpired
    );

    return () => {
      contextEventEmitter.off(
        AuthContextEventId.CHECK_TOKEN_STATUS,
        handleSetTokenExpired
      );
    };
    // Ajoutez accessToken et refreshToken aux dépendances de l'effet
  }, [accessToken, refreshToken]);

  if (!isUserInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        tokenExpired,
        setTokenExpired,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        isUserInitialized,
        needTokenChange,
      }}
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
