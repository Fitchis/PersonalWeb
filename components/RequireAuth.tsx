"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
      <div className="text-center text-lg text-red-400 flex flex-col items-center gap-2">
        <div>Please log in to access this feature.</div>
        <Link
          href="/auth/signin"
          className="inline-block mt-2 px-6 py-2 rounded-lg bg-yellow-500 text-white font-bold shadow hover:bg-yellow-600 transition-colors border border-yellow-400/40"
        >
          Login Now
        </Link>
      </div>
    );
  }
  return <>{children}</>;
}
