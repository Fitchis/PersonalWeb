"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <button disabled>Loading...</button>;

  if (session) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span>Hi, {session.user?.name || session.user?.email}</span>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    );
  }
  return <button onClick={() => signIn()}>Login with GitHub</button>;
}
