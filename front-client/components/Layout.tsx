import React, { useEffect } from "react";
import Header from "./Header";
import Nav from "./Nav";
import { useSocket } from '@/utils/contexts/socket-context';
import { useUser } from '@/utils/contexts/auth-context';
import { ClientToServerId } from '@/utils/socket/socket.enums';
import { SendSocket } from '@/utils/socket/send-socket';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { socket, isConnected } = useSocket(); // Ajoutez isConnected ici
  const { user } = useUser();

  useEffect(() => {
    console.log("layout --------------:", socket, user,isConnected)
    if (socket && user && isConnected) { // Ajoutez isConnected dans la condition
      const message = new SendSocket(socket.getSocket()!);
      message.send(ClientToServerId.GET_CONNECTED_USERS);
      console.log("message envoyé")
    }
  }, [socket, user, isConnected]); // Ajoutez isConnected ici

  return (
    <>
      <Header />
      <Nav />
      <main>{children}</main>
    </>
  );
}
