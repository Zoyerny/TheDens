import { useEffect, useState } from "react";
import { useHandler } from "@/utils/contexts/handler-context";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/utils/contexts/auth-context";

export interface User {
  id: string;
  username: string;
}

export default function UsersListHome() {
  const { onlineUsers } = useHandler();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (onlineUsers && onlineUsers.length > 0) {
      setIsLoading(false);
    }
  }, [onlineUsers]);

  if (isLoading) {
    return <div>Aucun Utilisateur connecté...</div>;
  }

  return (
    <div id="connectedUsers">
      <ul>
        {onlineUsers.map((user: User) => (
          <li key={user.id}>
            <Link className="link" href={`/private-chat/${user.id}`}>
              <Image
                className="svg"
                src="/svg/rond_vert.svg"
                width={12}
                height={12}
                alt="Open Nav"
              />
              <div className="contentUser">
                <h3 className="NameUser ellipsis">{user.username}</h3>
                <p className="sub ellipsis">Mora - Dessin</p>
                <div className="line"></div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
