import { LOGOUT_MUTATION } from "@/graphql/logout.mutation";
import { useAuth } from "@/utils/contexts/auth-context";
import { SendSocket } from "@/utils/socket/send-socket";
import { useSocket } from "@/utils/contexts/socket-context";
import { ClientToServerId } from "@/utils/socket/socket.enums";
import { useMutation } from "@apollo/client";
import { setCookie } from "nookies";
import React from "react";

export default function NavSettings() {
  const { user, setUser, setAccessToken, setRefreshToken } = useAuth();
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  const { isConnected, sendMessage } = useSocket();

  const handleGetList = () => {
    if (isConnected) {
      sendMessage(ClientToServerId.GET_CONNECTED_USERS);
    }
  };

  const handleLogout = async () => {
    if (!user) return;

    try {
      await logoutMutation({ variables: { id: user.id } });

      // Supprimez les tokens des Cookies

      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      //socket?.getSocket()?.disconnect();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <>
      <button onClick={handleGetList}>Get connected users</button>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
