"use client";

import { useSession } from "next-auth/react";
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
    );

  if (status === "unauthenticated")
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-red-500/10 backdrop-blur-lg rounded-2xl border border-red-500/20">
          <div className="text-red-400 text-xl font-medium">
            Silakan login untuk mengakses profil.
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
      setError(data.error || "Gagal update profil");
      setToast({ message: data.error || "Gagal update profil", type: "error" });
    } else {
      setSuccess("Profil berhasil diupdate");
      setToast({ message: "Profil berhasil diupdate", type: "success" });
      await update();
      setPassword("");
      setTimeout(() => {
        router.push("/");
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(75,85,99,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(107,114,128,0.2),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(156,163,175,0.1),transparent_50%)]"></div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg">
          {/* Profile Card */}
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="relative p-8 pb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800/30 to-gray-700/30"></div>
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center shadow-lg border border-gray-600">
                  <svg
                    className="w-10 h-10 text-gray-200"
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
                <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
                  Edit Profil
                </h1>
                <p className="text-center text-gray-400 mt-2">
                  Perbarui informasi akun Anda
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl backdrop-blur-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl backdrop-blur-sm">
                  {success}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={session?.user?.email || ""}
                    readOnly
                    className="w-full bg-gray-900/60 border border-gray-700/60 rounded-xl px-4 py-4 pl-12 text-gray-400 cursor-not-allowed backdrop-blur-sm transition-all duration-200"
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
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
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-900/60 border border-gray-700/60 rounded-xl px-4 py-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-600/70"
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
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
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium">
                  New Password{" "}
                  <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-gray-900/60 border border-gray-700/60 rounded-xl px-4 py-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-600/70"
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
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
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-1/2 bg-gray-700 text-gray-200 py-4 rounded-xl font-semibold border border-gray-600 hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 relative bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden group border border-gray-600"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    {loading && (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    <span>{loading ? "Menyimpan..." : "Simpan Perubahan"}</span>
                  </div>
                </button>
              </div>
            </form>
          </div>
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
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
}
