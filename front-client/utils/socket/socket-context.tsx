import React, { createContext, useContext, useEffect, useState } from "react";
import { createSocketConnection } from "@/utils/socket/socket";
import { Socket } from "socket.io-client";
import { useUser } from "../auth-context";
import { HandlerSocket } from "@/utils/socket/handler-socket";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
});

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        const newSocket = createSocketConnection(token);

        // Créez une instance de HandlerSocket pour gérer les écouteurs
        new HandlerSocket(newSocket);

        setSocket(newSocket);

        // Nettoyer la connexion socket lors du démontage du composant
        return () => {
          newSocket.disconnect();
        };
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
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
