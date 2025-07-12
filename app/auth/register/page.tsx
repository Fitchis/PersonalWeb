"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    setIsLoading(false);

    if (!res.ok) {
      setError(data.error || "Registration failed");
    } else {
      setSuccess("Registration successful! Please sign in.");
      setTimeout(() => router.push("/auth/signin"), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Minimal dark pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))] blur-3xl"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>

      {/* Floating accent */}
      <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse"></div>

      <div className="w-full max-w-sm z-10">
        {/* Compact header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 rounded-xl border border-zinc-800 mb-4">
            <svg
              className="w-6 h-6 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-zinc-400 text-sm">Sign up to get started</p>
        </div>

        {/* Compact form card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-2xl border border-zinc-800/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm text-center">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 px-3 py-2.5 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 px-3 py-2.5 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 px-3 py-2.5 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                  <span className="text-sm">Creating...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        {/* Compact footer */}
        <div className="text-center mt-6">
          <span className="text-zinc-500 text-sm">
            Already have an account?{" "}
          </span>
          <Link
            href="/auth/signin"
            className="text-blue-400 hover:text-blue-300 font-medium text-sm"
          >
            Sign In
          </Link>
        </div>

        {/* Minimal trust indicators */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-zinc-600">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Secured</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
