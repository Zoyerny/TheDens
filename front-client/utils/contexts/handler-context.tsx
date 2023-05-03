import React, { createContext, useContext, useEffect, useState } from "react";
import { contextEventEmitter } from "../socketToContext/event-emitter";
import { HandlerContextEventId } from "../socketToContext/event.enums";

/*export interface OnlineUserType {
  id: string;
  socketId: string;
  username: string;
  email: string;
  connectedAt: Date;
}

export interface OfflineUserType {
  id: string;
  username: string;
  email: string;
}*/

export interface HandlerContextType {
  loadingHandler: boolean;
  setLoadingHandler: (loading: boolean) => void;
  onlineUsers: [];
  setOnlineUsers: (onlineUsers: []) => void;
  offlineUsers: [];
  setOfflineUsers: (offlineUsers: []) => void;
}

const HandlerContext = createContext<HandlerContextType>({
  loadingHandler: false,
  setLoadingHandler: () => {},
  onlineUsers: [],
  setOnlineUsers: () => {},
  offlineUsers: [],
  setOfflineUsers: () => {},
});

interface HandlerProviderProps {
  children: React.ReactNode;
}

export const HandlerProvider: React.FC<HandlerProviderProps> = ({
  children,
}) => {
  const [loadingHandler, setLoadingHandler] = useState<boolean>(true);
  const [onlineUsers, setOnlineUsers] = useState<[]>([]);
  const [offlineUsers, setOfflineUsers] = useState<[]>([]);

  return (
    <HandlerContext.Provider
      value={{
        loadingHandler,
        setLoadingHandler,
        onlineUsers: onlineUsers,
        setOnlineUsers: setOnlineUsers,
        offlineUsers: offlineUsers,
        setOfflineUsers: setOfflineUsers,
      }}
    >
      {children}
    </HandlerContext.Provider>
  );
};

export const useHandler = () => {
  const context = useContext(HandlerContext);

  if (context === undefined) {
    throw new Error("useHandler must be used within an AuthProvider");
  }

  return context;
};
