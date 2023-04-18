type RouteConfig = {
  paths: string[]; // Changez "path" en "paths"
  condition: (user: any, loading: boolean, tokenExpired: boolean) => boolean;
  redirectTo: string;
};

export const routesConfig: RouteConfig[] = [
  {
    paths: ["/login"],
    condition: (user, loading, tokenExpired) => {
      const result = (!loading && user && !tokenExpired);
      return result;
    },
    redirectTo: "/",
  },
  {
    paths: ["/"],
    condition: (user, loading, tokenExpired) => {
      const result = (!loading && (!user || tokenExpired));
      return result;
    },
    redirectTo: "/login",
  },
  // Ajoutez d'autres routes ici
];
