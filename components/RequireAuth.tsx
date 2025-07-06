"use client";
import { useSession } from "next-auth/react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated")
    return (
      <div className="text-center text-lg text-red-400">
        Silakan login untuk mengakses fitur ini.
      </div>
    );
  return <>{children}</>;
}
