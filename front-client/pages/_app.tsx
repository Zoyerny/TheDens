import Layout from "@/components/Layout";
import "../styles/style.scss";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import { AuthProvider, useAuth } from "@/utils/contexts/auth-context";
import { client } from "@/utils/appollo/apolloClient";
import React from "react";
import { SocketProvider } from "@/utils/contexts/socket-context";
import { HandlerProvider } from "@/utils/contexts/handler-context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <HandlerProvider>
          <SocketProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SocketProvider>
        </HandlerProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
