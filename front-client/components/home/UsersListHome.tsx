import { useQuery } from "@apollo/client";
import { ONLINE_OFFLINE_USERS_QUERY } from "@/graphql/onlineOfflineUsers.query";

export interface User {
  id: string;
  username: string;
}

export interface OnlineOfflineUsersData {
  onlineUsers: User[];
  offlineUsers: User[];
}

export default function UsersListHome() {
  const { loading, error, data } = useQuery<OnlineOfflineUsersData>(
    ONLINE_OFFLINE_USERS_QUERY
  );

  if (loading) return <p>Loading...</p>;

  // Gérez les erreurs d'autorisation
  if (error) {
    if (error.message === "Unauthorized") {
      return null;
    }
    return <p>Error :( <br/> {error.message}</p>;
  }

  return (
    <div>
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
    </div>
  );
}
