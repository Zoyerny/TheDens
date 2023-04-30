import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/utils/contexts/auth-context";
import { routesConfig } from "@/utils/router/routesConfig";

function checkConditionsAndRedirect(
  user: any,
  loading: boolean,
  tokenExpired: boolean,
  router: ReturnType<typeof useRouter>,
  isRedirecting: boolean,
  setIsRedirecting: (value: boolean) => void
) {
  console.log("je passe ici");
  for (const route of routesConfig) {
    if (
      route.paths.includes(router.pathname) &&
      route.condition(user, loading, tokenExpired) &&
      router.pathname !== route.redirectTo &&
      !router.isFallback &&
      !isRedirecting
    ) {
      console.log(`Redirecting to ${route.redirectTo}`);
      setIsRedirecting(true);
      router.replace(route.redirectTo).then(() => setIsRedirecting(false));
      return;
    }
  }
}

export default function Router() {
  const { user, loading, tokenExpired } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      checkConditionsAndRedirect(
        user,
        loading,
        tokenExpired,
        router,
        isRedirecting,
        setIsRedirecting
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, tokenExpired]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (!loading) {
        checkConditionsAndRedirect(
          user,
          loading,
          tokenExpired,
          router,
          isRedirecting,
          setIsRedirecting
        );
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, user, loading, tokenExpired]);

  return <></>;
}
