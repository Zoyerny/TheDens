import React, { createContext, useContext, useEffect, useState } from "react";
import SocketConnection from "@/utils/socket/socket";
import { useAuth } from "@/utils/contexts/auth-context";
import { HandlerSocket } from "@/utils/socket/handler-socket";
import { contextEventEmitter } from "../socketToContext/event-emitter";
import { SocketContextEventId } from "../socketToContext/event.enums";

export interface SocketContextType {
  socket: SocketConnection | null;
  isConnected: boolean;
  setNeedChangeSocket: (bool: boolean) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  setNeedChangeSocket: () => {},
});

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<SocketConnection | null>(null);
  const [handlerSocket, setHandlerSocket] = useState<HandlerSocket | null>(
    null
  );
  const [needChangeSocket, setNeedChangeSocket] = useState<boolean>(false);

  const [isConnected, setisConnected] = useState<boolean>(false);
  const {
    user,
    tokenExpired,
    accessToken,
    refreshToken,
    isUserInitialized,
    needTokenChange,
  } = useAuth();

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
    if (
      needChangeSocket &&
      accessToken &&
      isTokenExpired(accessToken) &&
      refreshToken &&
      isTokenExpired(refreshToken) &&
      socket &&
      handlerSocket
    ) {
      socket.updateTokens(accessToken, refreshToken);
      handlerSocket.updateSocket(socket.getSocket()!);
    }
  }, [needChangeSocket, accessToken, refreshToken, handlerSocket, socket]);

  useEffect(() => {
    if (
      user &&
      accessToken &&
      !isTokenExpired(accessToken) && // Ajoutez le '!' ici
      refreshToken &&
      !isTokenExpired(refreshToken) && // Ajoutez le '!' ici
      !socket &&
      !handlerSocket
    ) {
      console.log("creation du Socket :");
      const socketConnectionInstance = new SocketConnection(
        user.id,
        accessToken,
        refreshToken
      );
      setSocket(socketConnectionInstance);
      console.log(socketConnectionInstance.getSocket());

      socketConnectionInstance.getSocket()!.on("connect", () => {
        console.log("Connected to the server");
      });

      socketConnectionInstance.getSocket()!.on("connect_error", (error) => {
        console.log("Connection error:", error);
      });
      // Créez une instance de HandlerSocket pour gérer les écouteurs
      const newHandlerSocket = new HandlerSocket(
        socketConnectionInstance.getSocket()!
      );
      setHandlerSocket(newHandlerSocket);
      // Nettoyer la connexion socket lors du démontage du composant
      return () => {
        socketConnectionInstance.getSocket()?.disconnect();
      };
    }
  }, [user, accessToken, refreshToken, handlerSocket, socket]);

  useEffect(() => {
    const handleSetIsConnected = (isLoading: boolean) => {
      setisConnected(isLoading);
    };

    // Ajoutez des écouteurs d'événements
    contextEventEmitter.on(
      SocketContextEventId.SET_ISCONNECTED,
      handleSetIsConnected
    );

    // Supprimez les écouteurs d'événements lors du nettoyage
    return () => {
      contextEventEmitter.off(
        SocketContextEventId.SET_ISCONNECTED,
        handleSetIsConnected
      );
    };
  }, []);

  /*useEffect(() => {
    console.log("Information socket :");
    console.log("user", user);
    console.log("socket", socket);
    console.log("handlerSocket", handlerSocket);
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);
    console.log("tokenExpired", tokenExpired);
    console.log("needTokenChange", needTokenChange);
    console.log("isUserInitialized", isUserInitialized);
    console.log("isTokenExpired(accessToken)", isTokenExpired(accessToken!));
    console.log("isTokenExpired(refreshToken)", isTokenExpired(refreshToken!));
    console.log("socket", socket);
    console.log("handlerSocket", handlerSocket);
  }, [
    handlerSocket,
    socket,
    user,
    accessToken,
    refreshToken,
    tokenExpired,
    needTokenChange,
    isUserInitialized,
  ]);*/

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, setNeedChangeSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};
