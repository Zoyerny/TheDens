import { LOGOUT_MUTATION } from "@/graphql/logout.mutation";
import { useUser } from "@/utils/auth-context";
import { SendSocket } from "@/utils/socket/send-socket";
import { createSocketConnection } from "@/utils/socket/socket";
import { useSocket } from "@/utils/socket/socket-context";
import { ClientToServerId, ServerToClientId } from "@/utils/socket/socket.enums";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";

export default function NavSettings() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  const { socket } = useSocket();

  const handleGetList = () => {
    if (socket) {
      const message = new SendSocket(socket);
      message.send(ClientToServerId.GET_CONNECTED_USERS);
    }
  };

  const handleLogout = async () => {
    if (!user) return;

    try {
      await logoutMutation({ variables: { id: user.id } });

      // Supprimez les tokens du sessionStorage
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");

      // Mettez à jour le contexte d'authentification pour supprimer l'utilisateur connecté
      setUser(null);

      // Redirigez l'utilisateur vers la page de connexion ou une autre page appropriée
      router.push("/login");
      socket!.disconnect();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return(
    <>
    <button onClick={handleGetList}>Get connected users</button>
    <button onClick={handleLogout}>Logout</button>
    </>
  ) 
}
