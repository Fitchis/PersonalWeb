"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading")
    return (
      <button
        className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 font-semibold cursor-not-allowed opacity-60 flex items-center gap-2"
        disabled
      >
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300"></div>
        Loading...
      </button>
    );

  if (session) {
    return (
      <div className="flex items-center gap-4 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-gray-600">
        <div className="flex flex-col">
          <span className="font-medium text-white text-sm">
            {session.user?.name || "User"}
          </span>
          {session.user?.email && (
            <span className="text-xs text-gray-400 truncate max-w-32">
              {session.user.email}
            </span>
          )}
        </div>
        <button
          onClick={() => signOut()}
          className="ml-2 px-3 py-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-md font-semibold hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 text-sm"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
    >
      Login
    </button>
  );
}
