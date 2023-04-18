import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/utils/contexts/auth-context";
import {routesConfig} from "@/utils/router/routesConfig";

function checkConditionsAndRedirect(
  user: any,
  loading: boolean,
  tokenExpired: boolean,
  router: ReturnType<typeof useRouter>
) {
  for (const route of routesConfig) {
    if (
      route.paths.includes(router.pathname) && 
      route.condition(user, loading, tokenExpired) &&
      router.pathname !== route.redirectTo
    ) {
      console.log(`Redirecting to ${route.redirectTo}`);
      router.replace(route.redirectTo);
      return;
    }
  }
}


export default function Router() {
  const { user, loading, tokenExpired } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      checkConditionsAndRedirect(user, loading, tokenExpired, router);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, tokenExpired]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (!loading) {
        checkConditionsAndRedirect(user, loading, tokenExpired, router);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router, user, loading, tokenExpired]);

  return <></>;
}