import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "@/utils/contexts/auth-context";
import { Socket, io } from "socket.io-client";
import { ClientToServerId, ServerToClientId } from "../socket/socket.enums";
import { useHandler } from "./handler-context";

export interface SocketContextType {
  isConnected: boolean;
  sendMessage: (type: ClientToServerId, data?: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  sendMessage: () => {},
});

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(socket?.connected ?? false);
  const { setOnlineUsers, setOfflineUsers } = useHandler();

  const { user, accessToken, refreshToken } = useAuth();

  const sendMessage = (type: ClientToServerId, data?: string) => {
    if (socket) {
      console.log("Message envoye <3");
      socket.emit("messageToServer", {
        type,
        data,
      });
    }
  };

  useEffect(() => {
    if (accessToken && refreshToken && user?.id) {
      const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!, {
        query: {
          token: accessToken,
          refreshToken: refreshToken,
          userId: user?.id,
        },
      });
      setSocket(socket);
    }

    return () => {
      socket?.disconnect();
    };
  }, [user?.id]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onConnectionError(error: any) {
      console.log("Connection error:", error);
    }

    function onConnectedUserList(data: any) {
      setOnlineUsers(data.onlineUsers);
      setOfflineUsers(data.offlineUsers);
    }

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectionError);
    socket.on("disconnect", onDisconnect);

    socket.on(ServerToClientId.CONNECTED_USERS_LIST, onConnectedUserList);

    return () => {
      socket.off("connect", onConnect);
      socket.on("connect_error", onConnectionError);
      socket.off("disconnect", onDisconnect);
      socket.off(ServerToClientId.CONNECTED_USERS_LIST, onConnectedUserList);
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ isConnected, sendMessage }}>
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
