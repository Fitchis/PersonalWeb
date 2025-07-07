"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Gagal register");
    else {
      setSuccess("Register berhasil! Silakan login.");
      setTimeout(() => router.push("/auth/signin"), 1500);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-16 space-y-4 bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl"
    >
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
        Register
      </h1>
      {error && <div className="text-red-500 text-center mb-2">{error}</div>}
      {success && (
        <div className="text-green-500 text-center mb-2">{success}</div>
      )}
      <input
        type="text"
        placeholder="Nama"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-600 bg-gray-700 px-3 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-600 bg-gray-700 px-3 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border border-gray-600 bg-gray-700 px-3 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
        required
      />
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200"
      >
        Register
      </button>
      <div className="text-center mt-4">
        <span className="text-gray-400">Sudah punya akun? </span>
        <a
          href="/auth/signin"
          className="text-green-400 hover:underline font-semibold"
        >
          Login
        </a>
      </div>
    </form>
  );
}
