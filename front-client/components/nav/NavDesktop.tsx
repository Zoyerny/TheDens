import React from "react";
import { useQuery } from "@apollo/client";
import { useUser } from "@/utils/contexts/auth-context";

export default function NavDesktop({ children }: { children: React.ReactNode }) {

  const { user } = useUser();

  return (
    <div id="NavDesktop">
      {user ? (
        <>
          <h2>Online Users</h2>
          <ul>
            coucou
          </ul>
          <h2>Offline Users</h2>
          <ul>
            coucou
          </ul>
          {children}
        </>
      ) : (
        <h2>Server connected</h2>
      )}
    </div>
  );
}
