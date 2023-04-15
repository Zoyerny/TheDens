import Layout from "@/components/Layout";
import "../styles/style.scss";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/utils/auth-context";
import { client } from "@/utils/apolloClient";
import Router from "@/utils/router";
import { createSocketConnection } from "@/utils/socket/socket";
import React, { useEffect } from "react";
import { SendSocket } from "@/utils/socket/send-socket";
import { ClientToServerId } from "@/utils/socket/socket.enums";
import { SocketProvider } from "@/utils/socket/socket-context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <SocketProvider>
          <Layout>
            <Router />
            <Component {...pageProps} />
          </Layout>
        </SocketProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}