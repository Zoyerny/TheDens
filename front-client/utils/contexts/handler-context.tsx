import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { contextEventEmitter } from "../socketToContext/event-emitter";
import { HandlerContextEventId } from "../socketToContext/event.enums";

export interface OnlineUserType {
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
}

export interface HandlerContextType {
  loadingHandler: boolean;
  setLoadingHandler: (loading: boolean) => void;
  onlineUsers: OnlineUserType[];
  setOnlineUsers: (onlineUsers: OnlineUserType[]) => void;
  offlineUsers: OfflineUserType[];
  setOfflineUsers: (offlineUsers: OfflineUserType[]) => void;
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
  const [onlineUsers, setOnlineUsers] = useState<OnlineUserType[]>([]);
  const [offlineUsers, setOfflineUsers] = useState<OfflineUserType[]>([]);
  

  useEffect(() => {
    const handleUpdateUsers = (data: {
      onlineUsers: OnlineUserType[];
      offlineUsers: OfflineUserType[];
    }) => {
      setOnlineUsers(data.onlineUsers);
      setOfflineUsers(data.offlineUsers);
    };

    const handleSetLoading = (isLoading: boolean) => {
      setLoadingHandler(isLoading);
    };

    const handleReset = () => {
      setOnlineUsers([]);
      setOfflineUsers([]);
    }

    // Ajoutez des écouteurs d'événements
    contextEventEmitter.on(HandlerContextEventId.UPDATE_USERS, handleUpdateUsers);
    contextEventEmitter.on(HandlerContextEventId.SET_LOADING, handleSetLoading);
    contextEventEmitter.on(HandlerContextEventId.RESET, handleReset);

    // Supprimez les écouteurs d'événements lors du nettoyage
    return () => {
      contextEventEmitter.off(HandlerContextEventId.UPDATE_USERS, handleUpdateUsers);
      contextEventEmitter.off(HandlerContextEventId.SET_LOADING, handleSetLoading);
      contextEventEmitter.off(HandlerContextEventId.RESET, handleReset);
    };
  }, []);

  return (
    <HandlerContext.Provider
      value={{
        loadingHandler,
        setLoadingHandler,
        onlineUsers: onlineUsers,
        setOnlineUsers: setOnlineUsers, // Modifie cette ligne
        offlineUsers: offlineUsers,
        setOfflineUsers: setOfflineUsers, // Modifie cette ligne
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
