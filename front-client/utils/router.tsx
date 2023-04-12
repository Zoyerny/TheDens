import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/utils/auth-context";

export default function Router() {
  const { user, loading } = useUser();
  const router = useRouter();

  // Redirige l'utilisateur vers la page de connexion si non authentifié
  useEffect(() => {
    console.log("user:", user); // Ajoutez des déclarations console.log pour le débogage
    console.log("loading:", loading);

    if (!loading) {
      if (!user) {
        console.log("Redirecting to /login");
        router.replace("/login");
      } else {
        console.log("Redirecting to /");
        router.replace("/");
      }
    }
  }, [user, loading, router]);

  return <></>;
}
