import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/utils/auth-context";

export default function Router() {
  const { user, loading } = useUser();
  const router = useRouter();

  // Redirige l'utilisateur vers la page de connexion si non authentifié
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else {
        router.replace("/");
      }
    }
  }, [user, loading]);

  return <></>;
}
