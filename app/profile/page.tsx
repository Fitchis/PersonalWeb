"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Toast from "../../components/Toast";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const [loading, setLoading] = useState(false);

  if (status === "loading")
    return <div className="text-center py-12">Loading...</div>;
  if (status === "unauthenticated")
    return (
      <div className="text-center py-12 text-red-400">
        Silakan login untuk mengakses profil.
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
      update(); // update session next-auth
      setPassword("");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-16 bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl space-y-6"
      >
        <h1 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Edit Profil
        </h1>
        {error && <div className="text-red-500 text-center mb-2">{error}</div>}
        {success && (
          <div className="text-green-500 text-center mb-2">{success}</div>
        )}
        <div>
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={session?.user?.email || ""}
            readOnly
            className="w-full border border-gray-600 bg-gray-700 px-3 py-3 rounded-lg text-gray-400 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 px-3 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">
            Password Baru (opsional)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 px-3 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
