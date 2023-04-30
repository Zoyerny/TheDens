import { LOGOUT_MUTATION } from "@/graphql/logout.mutation";
import { useAuth } from "@/utils/contexts/auth-context";
import { SendSocket } from "@/utils/socket/send-socket";
import { useSocket } from "@/utils/contexts/socket-context";
import { ClientToServerId } from "@/utils/socket/socket.enums";
import { useMutation } from "@apollo/client";
import { setCookie } from "nookies";
import React from "react";

export default function NavSettings() {
  const { user, setUser } = useAuth();
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  const { socket } = useSocket();

  const handleGetList = () => {
    if (socket) {
      const message = new SendSocket(socket.getSocket()!);
      message.send(ClientToServerId.GET_CONNECTED_USERS);
      console.log("ENVOIE DE LA DONNER REUSSI !");
    }
  };

  const handleTestToken = () => {
    if (socket) {
      const message = new SendSocket(socket.getSocket()!);
      message.testRefreshToken();
    }
  };

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

  const handleLogout = async () => {
    if (!user) return;

    try {
      await logoutMutation({ variables: { id: user.id } });

      // Supprimez les tokens des Cookies
      undefinedCookies();

      setUser(null);

      socket?.getSocket()?.disconnect();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <>
      <button onClick={handleTestToken}>handleTestToken</button>
      <button onClick={handleGetList}>Get connected users</button>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
