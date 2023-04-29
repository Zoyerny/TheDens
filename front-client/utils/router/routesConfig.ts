type RouteConfig = {
  paths: string[];
  condition: (user: any, loading: boolean, tokenExpired: boolean) => boolean;
  redirectTo: string;
};

export const routesConfig: RouteConfig[] = [
  {
    paths: ["/login"],
    condition: (user, loading, tokenExpired) => {
      const result = (!loading && user && !tokenExpired); //regarder si le refresh token est pas expirer plutot que le token 
      console.log(`/login result : ${result}, loading ${loading}, user ${user}, tokenExpired ${tokenExpired}`)
      return result;
    },
    redirectTo: "/",
  },
  {
    paths: ["/"],
    condition: (user, loading, tokenExpired) => {
      const result = (loading || !user || tokenExpired);
      console.log(`/ result : ${result}, loading ${loading}, user ${user}, tokenExpired ${tokenExpired}`)
      return result;
    },
    redirectTo: "/login",
    
  },
  // Ajoutez d'autres routes ici
];
