import { useAuth } from "@/utils/contexts/auth-context";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Acount() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  return <div>acount</div>;
}
