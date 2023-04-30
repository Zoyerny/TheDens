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
import { ClientToServerId } from "../socket/socket.enums";

export interface SocketContextType {
  isConnected: boolean;
  events: any[];
  sendMessage: (type: ClientToServerId, data?: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  events: [],
  sendMessage: () => {},
});

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(socket?.connected ?? false);
  const [events, setEvents] = useState<any[]>([]);

  const { user, tokenExpired, accessToken, refreshToken } = useAuth();

  const sendMessage = (type: ClientToServerId, data?: string) => {
    if (socket) {
      console.log("Message envoye <3", socket);
      socket.emit("Hello", "World");
      socket.emit("messageToServer", {
        type,
        data,
      });
    }
  };

  useEffect(() => {
    console.log("Common darling", accessToken, refreshToken, user?.id);
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
    console.log("INN Socket", socket);

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

    function onEvent(value: any) {
      setEvents((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectionError);
    socket.on("disconnect", onDisconnect);
    socket.on("connectedUsersList", onEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.on("connect_error", onConnectionError);
      socket.off("disconnect", onDisconnect);
      socket.off("connectedUsersList", onEvent);
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ isConnected, events, sendMessage }}>
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
