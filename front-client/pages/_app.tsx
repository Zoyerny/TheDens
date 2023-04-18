import Layout from "@/components/Layout";
import "../styles/style.scss";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/utils/contexts/auth-context";
import { client } from "@/utils/appollo/apolloClient";
import Router from "@/utils/router/router";
import React from "react";
import { SocketProvider } from "@/utils/contexts/socket-context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <SocketProvider>
          <Router />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SocketProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
