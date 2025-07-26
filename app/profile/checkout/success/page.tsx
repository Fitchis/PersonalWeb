import Link from "next/link";
import Navbar from "../../../profile/upgrade/_components/Navbar";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex flex-col relative overflow-hidden">
      <Navbar />
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="max-w-lg w-full mx-auto bg-gradient-to-br from-yellow-900/40 via-black/40 to-yellow-900/20 border border-yellow-700/30 rounded-3xl p-10 shadow-2xl text-center space-y-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent mb-4">
            Pembayaran Diterima (Simulasi)
          </h1>
          <p className="text-yellow-100 text-lg leading-relaxed mb-4">
            Terima kasih! Pembayaran Anda telah diterima (simulasi). Akun
            premium akan aktif setelah pembayaran terverifikasi oleh sistem.
          </p>
          <Link
            href="/profile"
            className="block w-full px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold shadow-lg hover:scale-105 transition-transform duration-200 border border-yellow-400/40 text-center"
          >
            Kembali ke Profil
          </Link>
        </div>
      </div>
    </div>
  );
}
