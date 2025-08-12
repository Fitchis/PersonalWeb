"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10 relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Kiri - Deskripsi Paket */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Upgrade ke Premium
          </h1>
          <p className="text-gray-300 text-base mb-6">
            Nikmati semua fitur tanpa batas, cocok untuk Anda yang serius
            belajar.
          </p>

          <div className="bg-blue-600/10 border border-blue-400/20 rounded-2xl p-5 sm:p-6 text-left text-sm mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-200 font-medium">Paket Premium</span>
              <span className="text-white font-bold text-xl">Rp 15.000</span>
            </div>
            <ul className="text-gray-400 list-disc pl-5 space-y-1 mt-2">
              <li>Akses interview & latihan soal</li>
              <li>Statistik performa lengkap</li>
              <li>Dukungan prioritas</li>
              <li>Berlaku 1 tahun penuh</li>
            </ul>
          </div>

          <button
            onClick={() => setShowQR(!showQR)}
            className="w-full py-3 rounded-xl bg-gradient-to-tr from-blue-500 to-blue-700 text-white font-semibold text-lg shadow-md hover:from-blue-400 hover:to-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {showQR ? "Sembunyikan QR" : "Tampilkan QR Pembayaran"}
          </button>

          <Link
            href="/profile"
            className="mt-6 inline-block text-gray-400 hover:text-gray-300 underline text-sm transition"
          >
            ← Kembali ke Profil
          </Link>
        </div>

        {/* Kanan - QR Code */}
        <div className="flex flex-col items-center justify-center">
          {showQR ? (
            <div className="animate-fadein text-center">
              <div className="bg-white p-4 rounded-2xl border-2 border-blue-400 shadow-2xl mb-3">
                <Image
                  src="/uploads/QRcode.jpg"
                  alt="QR Code Dana"
                  width={400}
                  height={400}
                  className="w-80 h-80 object-contain rounded-xl"
                  priority
                />
              </div>
              <p className="text-gray-200 text-sm">Scan QR Anda.</p>
            </div>
          ) : (
            <div className="text-gray-500 text-sm text-center italic">
              Klik tombol &quot;Bayar dengan Dana&quot; untuk melihat QR.
            </div>
          )}
        </div>

        {/* Background Dekorasi */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl z-0" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl z-0" />
      </div>

      {/* Tambahkan animasi fadein */}
      <style jsx global>{`
        @keyframes fadein {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadein {
          animation: fadein 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
