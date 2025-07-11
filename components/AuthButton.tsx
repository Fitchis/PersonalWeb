"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

import { useState } from "react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [loadingSignOut, setLoadingSignOut] = useState(false);

  if (status === "loading") {
    return (
      <Skeleton className="h-10 w-28 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-full animate-pulse" />
    );
  }

  if (session) {
    const userName = session.user?.name || "User";
    const userInitial = userName.charAt(0).toUpperCase();
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="group relative flex items-center gap-3 px-4 py-2 h-10 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 text-white hover:border-slate-500/50 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-slate-500/20 rounded-full overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
            aria-label="User menu"
            disabled={loadingSignOut}
          >
            <Avatar className="h-7 w-7 ring-2 ring-slate-600/50 group-hover:ring-slate-400/50 transition-all duration-300">
              <AvatarImage
                src={session.user?.image || undefined}
                alt={userName}
                className="object-cover"
              />
              <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium truncate max-w-[120px] relative z-10">
              {userName}
            </span>
            <div className="w-1 h-1 bg-slate-400 rounded-full group-hover:bg-slate-300 transition-colors duration-300" />
            {loadingSignOut && (
              <span className="ml-2 animate-spin w-4 h-4 border-2 border-slate-400/30 border-t-blue-400 rounded-full"></span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 text-white shadow-2xl shadow-slate-900/50 rounded-xl overflow-hidden"
        >
          <div className="px-4 py-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-b border-slate-700/50">
            <div className="font-semibold truncate text-slate-100">
              {userName}
            </div>
            {session.user?.email && (
              <div className="text-xs text-slate-400 truncate mt-1">
                {session.user.email}
              </div>
            )}
          </div>
          <div className="py-1">
            <DropdownMenuItem
              asChild
              className="mx-2 my-1 rounded-lg hover:bg-slate-800/70 focus:bg-slate-800/70 cursor-pointer transition-all duration-200 hover:shadow-sm"
              disabled={loadingSignOut}
            >
              <Link
                href="/profile"
                className="flex items-center px-3 py-2 text-slate-200 hover:text-white focus:text-white no-underline"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-70" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                setLoadingSignOut(true);
                await signOut();
                setLoadingSignOut(false);
              }}
              className="mx-2 my-1 rounded-lg text-red-400 hover:text-red-300 focus:text-red-300 hover:bg-red-900/20 focus:bg-red-900/20 cursor-pointer transition-all duration-200 hover:shadow-sm flex items-center"
              disabled={loadingSignOut}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3 opacity-70" />
              {loadingSignOut ? (
                <span className="mr-2 animate-spin w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full"></span>
              ) : null}
              Sign Out
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={async () => {
        setLoadingSignIn(true);
        await signIn();
        setLoadingSignIn(false);
      }}
      className="group relative h-10 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none rounded-full font-medium transition-all duration-300 ease-out hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
      aria-label="Sign in"
      disabled={loadingSignIn}
    >
      {loadingSignIn ? (
        <span className="mr-2 animate-spin w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full"></span>
      ) : null}
      <span className="relative z-10">Sign In</span>
    </Button>
  );
}
