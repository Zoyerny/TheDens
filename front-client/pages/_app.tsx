import Layout from "@/components/Layout";
import "../styles/style.scss";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/utils/auth-context";
import { client } from "@/utils/apolloClient";
import Router from "@/utils/router";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Layout>
          <Router />
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ApolloProvider>
  );
}
