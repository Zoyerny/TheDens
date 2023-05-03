import React, { useState, FormEvent, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/login.mutation";
import { useAuth } from "@/utils/contexts/auth-context";
import Image from "next/image";
import { setCookie } from "nookies";
import { useRouter } from "next/router";
import { useSocket } from "@/utils/contexts/socket-context";
import { SendSocket } from "@/utils/socket/send-socket";
import { ClientToServerId } from "@/utils/socket/socket.enums";
import { useHandler } from "@/utils/contexts/handler-context";

interface LoginResponse {
  signin: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      username: string;
      email: string;
      accessToken: string;
      refreshToken: string;
    };
  };
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser, setAccessToken, setRefreshToken } = useAuth();

  const router = useRouter();

  const [loginMutation, { loading, error }] =
    useMutation<LoginResponse>(LOGIN_MUTATION);

  useEffect(() => {
    if (user) {
      router.push("/acount");
    }
  }, [user]);

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    loginMutation({
      variables: {
        input: {
          email,
          password,
        },
      },
    })
      .then((result) => {
        if (result.data) {
          setUser(result.data.signin.user);
          setAccessToken(result.data.signin.accessToken);
          setRefreshToken(result.data.signin.refreshToken);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <form
      id="login"
      autoComplete="off"
      onSubmit={(event) => handleLogin(event)}
    >
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        autoFocus
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && (
        <div style={{ color: "red" }}>
          {error.graphQLErrors.map(({ message }, i) => (
            <span key={i}>{message}</span>
          ))}
        </div>
      )}
      <button type="submit">
        <Image src="/svg/Send.svg" width={26.13} height={24} alt="Send" />
      </button>
    </form>
  );
}
