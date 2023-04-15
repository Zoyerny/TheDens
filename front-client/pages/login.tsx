import React, { useState, FormEvent } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/loginMutation";
import { useUser } from "@/utils/auth-context";
import Image from "next/image";

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
  const { setUser } = useUser();

  const [loginMutation, { loading, error }] =
    useMutation<LoginResponse>(LOGIN_MUTATION);

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    console.log("login");
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

          // Stockez les tokens dans le sessionStorage
          if (typeof window !== "undefined") {
            sessionStorage.setItem(
              "accessToken",
              result.data.signin.accessToken
            );
            sessionStorage.setItem(
              "refreshToken",
              result.data.signin.refreshToken
            );
          }
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
