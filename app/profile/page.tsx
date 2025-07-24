"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Toast from "../../components/Toast";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session?.user?.name]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (status === "loading")
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-900 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-2 w-16 h-16 border-4 border-gray-800 border-t-indigo-500 rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
    );

  if (status === "unauthenticated")
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center p-8 bg-red-950/30 backdrop-blur-xl rounded-2xl border border-red-900/50 shadow-2xl">
          <div className="text-red-400 text-xl font-semibold mb-2">
            Authentication Required
          </div>
          <div className="text-red-300/60 text-sm">
            Please log in to access your profile.
          </div>
        </div>
      </div>
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({ name, password: password || undefined }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Failed to update profile");
      setToast({
        message: data.error || "Failed to update profile",
        type: "error",
      });
    } else {
      setSuccess("Profile updated successfully");
      setToast({ message: "Profile updated successfully", type: "success" });
      await update();
      setPassword("");
      setTimeout(() => {
        router.push("/");
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(75,85,99,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(75,85,99,0.02)_1px,transparent_1px)] bg-[length:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      {/* Gradient Orbs - Darker */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-800/8 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-700/8 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-violet-800/8 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse animation-delay-4000"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${10 + Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-2">
        <div className="w-full max-w-sm">
          {/* Main Profile Card */}
          <div className="bg-gray-950/90 backdrop-blur-2xl rounded-2xl border border-gray-800/60 shadow-2xl overflow-hidden p-4">
            {/* Header Section */}
            <div className="relative p-4 pb-3">
              {/* Header Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-gray-950/50 to-indigo-950/20"></div>

              <div className="relative text-center">
                {/* Profile Avatar */}
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-700 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl border border-gray-800/60 group hover:scale-105 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300"
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
                </div>

                <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-purple-400 via-gray-100 to-indigo-400 bg-clip-text text-transparent">
                  Profile Settings
                </h1>
                <p className="text-gray-500 text-xs">
                  Manage your account preferences
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-4 pt-1">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Status Messages */}
                {error && (
                  <div className="bg-red-950/60 border border-red-900/60 text-red-400 px-4 py-3 rounded-xl backdrop-blur-sm flex items-center gap-3">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm">{error}</span>
                  </div>
                )}
                {success && (
                  <div className="bg-green-950/60 border border-green-900/60 text-green-400 px-4 py-3 rounded-xl backdrop-blur-sm flex items-center gap-3">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm">{success}</span>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-3">
                  <label className="block text-gray-300 text-sm font-medium">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700/15 to-indigo-700/15 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <input
                      type="email"
                      value={session?.user?.email || ""}
                      readOnly
                      className="relative w-full bg-gray-900/60 border border-gray-800/60 rounded-xl px-4 py-4 pl-12 text-gray-500 cursor-not-allowed backdrop-blur-sm transition-all duration-300"
                    />
                    <svg
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Name Field */}
                <div className="space-y-3">
                  <label className="block text-gray-300 text-sm font-medium">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700/15 to-indigo-700/15 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="relative w-full bg-gray-900/60 border border-gray-800/60 rounded-xl px-4 py-4 pl-12 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600/60 focus:border-purple-600/60 backdrop-blur-sm transition-all duration-300 hover:border-gray-700"
                    />
                    <svg
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600"
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
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <label className="block text-gray-300 text-sm font-medium">
                    New Password{" "}
                    <span className="text-gray-600 text-xs font-normal">
                      (optional)
                    </span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700/15 to-indigo-700/15 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="relative w-full bg-gray-900/60 border border-gray-800/60 rounded-xl px-4 py-4 pl-12 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600/60 focus:border-purple-600/60 backdrop-blur-sm transition-all duration-300 hover:border-gray-700"
                    />
                    <svg
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 bg-gray-900/60 text-gray-300 py-2 rounded-xl font-medium border border-gray-800/60 hover:bg-gray-800/60 hover:border-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm text-sm"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 relative bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-2 rounded-xl font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden group text-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      {loading && (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      <span>{loading ? "Saving..." : "Save Changes"}</span>
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Connect Account Section */}
          {session && (
            <div className="mt-4 text-center">
              <div className="bg-gray-950/70 backdrop-blur-xl rounded-2xl border border-gray-800/60 p-3 shadow-xl">
                <h3 className="text-base font-semibold text-gray-200 mb-2">
                  Connect Your Accounts
                </h3>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      signIn("github", {
                        callbackUrl: "/profile/connect/github",
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900/60 text-white rounded-xl hover:bg-gray-800/60 transition-all duration-300 border border-gray-800/60 hover:border-gray-700 shadow-sm hover:shadow-md group text-xs"
                  >
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">GitHub</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      signIn("google", {
                        callbackUrl: "/profile/connect/google",
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-all duration-300 border border-gray-300 shadow-sm hover:shadow-md group text-xs"
                  >
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                      viewBox="0 0 48 48"
                    >
                      <g>
                        <path
                          fill="#4285F4"
                          d="M24 9.5c3.54 0 6.36 1.53 7.82 2.81l5.77-5.77C34.64 3.61 29.74 1.5 24 1.5 14.98 1.5 7.06 7.86 4.13 16.14l6.91 5.37C12.83 15.13 17.97 9.5 24 9.5z"
                        />
                        <path
                          fill="#34A853"
                          d="M46.1 24.5c0-1.64-.15-3.22-.43-4.74H24v9.24h12.42c-.54 2.9-2.18 5.36-4.65 7.04l7.18 5.59C43.93 37.13 46.1 31.3 46.1 24.5z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M11.04 28.09A14.48 14.48 0 019.5 24c0-1.42.24-2.8.66-4.09l-6.91-5.37A23.97 23.97 0 001.5 24c0 3.77.9 7.34 2.49 10.46l7.05-6.37z"
                        />
                        <path
                          fill="#EA4335"
                          d="M24 46.5c6.48 0 11.93-2.14 15.9-5.84l-7.18-5.59c-2 1.36-4.56 2.18-8.72 2.18-6.03 0-11.17-5.63-12.96-13.01l-7.05 6.37C7.06 40.14 14.98 46.5 24 46.5z"
                        />
                        <path fill="none" d="M1.5 1.5h45v45h-45z" />
                      </g>
                    </svg>
                    <span className="text-sm font-medium">Google</span>
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">
                  The account will be connected to your profile
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 0.6;
          }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .animate-reverse {
          animation-direction: reverse;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
