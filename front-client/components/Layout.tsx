import React, { useEffect, useState } from "react";
import Header from "./Header";
import Nav from "./Nav";

//const MAX_INACTIVE_TIME_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <Header />
      <Nav />
      <main>{children}</main>
    </>
  );
}
