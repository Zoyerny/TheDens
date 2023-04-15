import React, { useEffect, useState } from "react";
import NavDesktop from "./nav/NavDesktop";
import NavSettings from "./nav/NavSettings";
import NavMobile from "./nav/NavMobile";

export default function Nav() {
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(document.documentElement.clientWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile ? (
        <nav>
          <NavMobile/>
        </nav>
      ) : (
        <>
          <nav></nav>
          <NavDesktop>
            <NavSettings/>
          </NavDesktop>
        </>
      )}
    </>
  );
}


/*import { useMutation } from "@apollo/client";
import { LOGOUT_MUTATION } from "@/graphql/logoutMutation";

const { user } = useUser();

const [logoutMutation] = useMutation(LOGOUT_MUTATION);

const handleLogout = async () => {
  try {
    await logoutMutation({ variables: { userId: user.id } });
    setUser(null);
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    // Redirigez l'utilisateur vers la page de connexion
  } catch (error) {
    console.error("Error during logout:", error);
  }
};*/