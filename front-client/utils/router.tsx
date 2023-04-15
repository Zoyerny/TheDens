import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/utils/auth-context";

export default function Router() {
  const { user } = useUser();
  const router = useRouter();

  // Redirige l'utilisateur vers la page de connexion si non authentifié
  useEffect(() => {
    if (!user) {
      console.log("Redirecting to /login");
      router.replace("/login");
    } else {
      console.log("Redirecting to /");
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return <></>;
}
