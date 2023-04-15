import React, { createContext, useContext, useEffect, useState } from "react";

// Définition du type UserType pour stocker les informations utilisateur et les tokens
export interface UserType {
  id: string;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

// Définition du type pour le contexte d'authentification
export interface AuthContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Création du contexte d'authentification avec des valeurs par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

// Composant AuthProvider pour gérer l'authentification et fournir les informations utilisateur
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Récupération de l'accessToken depuis le sessionStorage
  const accessToken =
    typeof window !== "undefined"
      ? sessionStorage.getItem("accessToken")
      : null;

  // Gestion de l'état de chargement en fonction de la disponibilité de l'accessToken et des données de l'utilisateur
  useEffect(() => {
    if (accessToken) {
      if (!user) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user,accessToken]);

  // Fourniture du contexte d'authentification aux composants enfants
  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour accéder au contexte d'authentification dans d'autres composants
export const useUser = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useUser must be used within an AuthProvider");
  }

  return context;
};
