import React, { useEffect, useState } from "react";
import Header from "./Header";
import Nav from "./Nav";
import { useUser } from "@/utils/auth-context";
import { useMutation } from "@apollo/client";
import { LOGOUT_MUTATION } from "@/graphql/logout.mutation";
import { useRouter } from "next/router";

const MAX_INACTIVE_TIME_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  /*useEffect(() => {
    if (!user) return;

    const handleLogout = async () => {
      try {
        await logoutMutation({ variables: { id: user.id } });
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        setUser(null);
        router.push("/login");
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    const handleMouseMove = () => {
      setLastActivity(Date.now());
    };

    const handleKeyPress = () => {
      setLastActivity(Date.now());
    };

    const checkInactivity = setInterval(() => {
      if (Date.now() - lastActivity > 30000) {
        clearInterval(checkInactivity);
        handleLogout();
      }
    }, 1000);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keypress", handleKeyPress);
      clearInterval(checkInactivity);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, logoutMutation, lastActivity, setUser]);*/

  return (
    <>
      <Header />
      <Nav />
      <main>{children}</main>
    </>
  );
}
