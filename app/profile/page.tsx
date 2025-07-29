"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ProfileEditModal from "@/app/profile/_components/ProfileEditModal";
import Image from "next/image";
import { signIn } from "next-auth/react";
import Navbar from "./_components/Navbar";

function Page() {
  const { data: session, status } = useSession();
  const [showEdit, setShowEdit] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Silakan login untuk melihat profil Anda.
      </div>
    );
  }

  const user = session?.user;
  const isPremium = user?.isPremium === true;
  const isGoogleLinked =
    user?.accounts?.some((a) => a.provider === "google") ?? false;
  const isGitHubLinked =
    user?.accounts?.some((a) => a.provider === "github") ?? false;
  // Fungsi unlink Google
  const handleUnlinkGoogle = async () => {
    try {
      await fetch("/api/auth/unlink/google", { method: "POST" });
      window.location.reload();
    } catch {
      alert("Gagal unlink Google");
    }
  };

  const handleUnlinkGitHub = async () => {
    try {
      await fetch("/api/auth/unlink/github", { method: "POST" });
      window.location.reload();
    } catch {
      alert("Gagal unlink GitHub");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 h-full">
          {/* Left Section - Profile Information */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl p-8">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  {user?.image ? (
                    <Image
                      width={80}
                      height={80}
                      src={user.image}
                      alt="Profile"
                      className="w-20 h-20 rounded-2xl object-cover"
                    />
                  ) : (
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {user?.name || "User"}
                  </h1>
                  <p className="text-gray-400 text-lg mb-3">
                    {user?.email || "-"}
                  </p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${isPremium ? "bg-green-400" : "bg-orange-400"}`}
                    ></div>
                    <span
                      className={
                        isPremium ? "text-green-400" : "text-orange-400"
                      }
                    >
                      {isPremium ? "Premium Member" : "Free Member"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
                onClick={() => setShowEdit(true)}
              >
                Edit Profile
              </button>
            </div>

            {/* Detailed Information */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl p-8">
              <h2 className="text-xl font-semibold text-white mb-6">
                Account Details
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">User ID</span>
                  <span className="text-white font-mono text-sm">
                    {user?.id || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">Role</span>
                  <span className="text-white capitalize">
                    {user?.role || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">Email Verified</span>
                  <span
                    className={
                      user?.emailVerified ? "text-green-400" : "text-red-400"
                    }
                  >
                    {user?.emailVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-white">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Actions & Navigation */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl p-8">
              <h2 className="text-xl font-semibold text-white mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <Link
                  href="/profile/checkout"
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-600/20 to-blue-800/20 border border-blue-500/30 text-white hover:from-blue-600/30 hover:to-blue-800/30 transition-all group"
                >
                  <div>
                    <div className="font-medium">Upgrade Premium</div>
                    <div className="text-sm text-gray-400">
                      Upgrade to premium features
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Connected Accounts */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl p-8">
              <h2 className="text-xl font-semibold text-white mb-6">
                Connected Accounts
              </h2>
              <div className="space-y-4">
                {/* github */}
                <button
                  type="button"
                  onClick={
                    isGitHubLinked ? handleUnlinkGitHub : () => signIn("github")
                  }
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-600/20 to-gray-800/20 border border-gray-500/30 text-white hover:from-gray-600/30 hover:to-gray-800/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <div>
                      <div className="font-medium">
                        {isGitHubLinked ? "Unlink GitHub" : "Connect GitHub"}
                      </div>
                      <div className="text-sm text-gray-400">
                        {isGitHubLinked
                          ? "Unlink your GitHub account"
                          : "Link your GitHub account"}
                      </div>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                {/* Google */}
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-600/20 to-red-800/20 border border-red-500/30 text-white hover:from-red-600/30 hover:to-red-800/30 transition-all group"
                  onClick={
                    isGoogleLinked ? handleUnlinkGoogle : () => signIn("google")
                  }
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <div>
                      <div className="font-medium">
                        {isGoogleLinked ? "Unlink Google" : "Connect Google"}
                      </div>
                      <div className="text-sm text-gray-400">
                        {isGoogleLinked
                          ? "Unlink your Google account"
                          : "Link your Google account"}
                      </div>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <ProfileEditModal
          open={showEdit}
          onClose={() => setShowEdit(false)}
          initialName={user?.name || ""}
          initialEmail={user?.email || ""}
        />
      </div>
    </>
  );
}

export default Page;
