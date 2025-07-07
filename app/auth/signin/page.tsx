"use client";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Toast from "../../../components/Toast";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const router = useRouter();

  // Auto close toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Email atau password salah");
      setToast({ message: "Email atau password salah", type: "error" });
    }
    if (res?.ok) {
      setToast({ message: "Login berhasil!", type: "success" });
      setTimeout(() => router.push("/"), 1000);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto mt-16 space-y-4 bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Login
        </h1>
        {error && <div className="text-red-500 text-center mb-2">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 px-3 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 px-3 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          required
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          Login
        </button>
        <div className="text-center mt-4">
          <span className="text-gray-400">Belum punya akun? </span>
          <a
            href="/auth/register"
            className="text-blue-400 hover:underline font-semibold"
          >
            Daftar
          </a>
        </div>
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
