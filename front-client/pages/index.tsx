import UsersListHome from "@/components/home/UsersListHome";
import { useAuth } from "@/utils/contexts/auth-context";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  return (
    <>
      <UsersListHome />
    </>
  );
}
