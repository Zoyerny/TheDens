import React, { useEffect } from "react";
import Header from "./Header";
import Nav from "./Nav";
import { useSocket } from "@/utils/contexts/socket-context";
import { useAuth } from "@/utils/contexts/auth-context";
import { ClientToServerId } from "@/utils/socket/socket.enums";
import { SendSocket } from "@/utils/socket/send-socket";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { sendMessage, events, isConnected } = useSocket(); // Ajoutez isConnected ici
  const { user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      sendMessage(ClientToServerId.GET_CONNECTED_USERS);
    }
  }, [isConnected]);

  return (
    <>
      <Header />
      <Nav />
      <main>{children}</main>
    </>
  );
}
