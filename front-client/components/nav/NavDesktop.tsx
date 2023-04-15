import React from "react";
import { useQuery } from "@apollo/client";
import { ONLINE_OFFLINE_USERS_QUERY } from "@/graphql/onlineOfflineUsers.query";
import { useUser } from "@/utils/auth-context";

export interface User {
  id: string;
  username: string;
}

export interface OnlineOfflineUsersData {
  onlineUsers: User[];
  offlineUsers: User[];
}

export default function NavDesktop({ children }: { children: React.ReactNode }) {
  const { loading, error, data } = useQuery<OnlineOfflineUsersData>(
    ONLINE_OFFLINE_USERS_QUERY
  );

  const { user } = useUser();

  return (
    <div id="NavDesktop">
      {user ? (
        <>
          <h2>Online Users</h2>
          <ul>
            {data?.onlineUsers.map((user: User) => (
              <li key={user.id}>{user.username}</li>
            ))}
          </ul>
          <h2>Offline Users</h2>
          <ul>
            {data?.offlineUsers.map((user: User) => (
              <li key={user.id}>{user.username}</li>
            ))}
          </ul>
          {children}
        </>
      ) : (
        <h2>Server connected</h2>
      )}
    </div>
  );
}
