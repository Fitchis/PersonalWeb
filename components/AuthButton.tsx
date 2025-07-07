"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading")
    return (
      <button
        className="group relative px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-slate-300 font-medium cursor-not-allowed overflow-hidden border border-slate-700/50 backdrop-blur-sm"
        disabled
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50"></div>
        <div className="relative flex items-center gap-2 sm:gap-3">
          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-slate-400/30 border-t-blue-400"></div>
          <span className="text-xs sm:text-sm tracking-wide">Loading...</span>
        </div>
      </button>
    );

  if (session) {
    return (
      <div className="group relative flex items-center gap-2 sm:gap-4 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl px-3 py-2 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:border-slate-600/70 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xs sm:text-sm">
                {session.user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-slate-800 shadow-lg"></div>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-semibold text-white text-xs sm:text-base leading-tight truncate max-w-[80px] sm:max-w-none">
              {session.user?.name || "User"}
            </span>
            {session.user?.email && (
              <span className="text-[10px] text-slate-400 truncate max-w-[80px] sm:max-w-40 mt-0.5 hidden sm:block">
                {session.user.email}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="relative flex-shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white rounded-lg sm:rounded-xl font-medium hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 text-xs sm:text-sm shadow-lg hover:shadow-red-500/25 transform hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-lg sm:rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
          <span className="relative">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95 overflow-hidden backdrop-blur-sm border border-blue-500/20"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <span className="relative flex items-center gap-2 sm:gap-3 text-sm sm:text-base tracking-wide">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          />
        </svg>
        Sign In
      </span>
    </button>
  );
}
