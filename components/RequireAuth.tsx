"use client";
import { useSession } from "next-auth/react";

export function RequireAuth({
  children,
  preview,
}: {
  children: React.ReactNode;
  preview?: React.ReactNode;
}) {
  const { status } = useSession();
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") {
    if (preview) return <>{preview}</>;
    return (
      <div className="text-center text-lg text-red-400">
        Please log in to access this feature.
      </div>
    );
  }
  return <>{children}</>;
}
