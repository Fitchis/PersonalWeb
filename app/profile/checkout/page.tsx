import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-10 text-center relative overflow-hidden">
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-white mb-3">
          Pembayaran Premium
        </h1>
        <p className="text-gray-300 text-base mb-6">
          Aktifkan akun premium Anda untuk menikmati semua fitur tanpa batas.
        </p>

        {/* Paket Detail */}
        <div className="bg-blue-600/10 border border-blue-400/20 rounded-2xl p-5 text-left text-sm mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-200 font-medium">Paket Premium</span>
            <span className="text-white font-bold text-xl">Rp 15.000</span>
          </div>
          <ul className="text-gray-400 list-disc pl-5 space-y-1 mt-2">
            <li>Akses fitur interview dan latihan soal</li>
            <li>Statistik performa lengkap</li>
            <li>Dukungan prioritas</li>
            <li>Berlaku selama 1 tahun penuh</li>
          </ul>
        </div>

        {/* Tombol Bayar */}
        <form method="POST" action="/api/dana/checkout" className="space-y-4">
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-tr from-blue-500 to-blue-700 text-white font-semibold text-lg shadow-md hover:from-blue-400 hover:to-blue-600 transition-all duration-200"
          >
            Bayar dengan Dana
          </button>
        </form>

        {/* Link Kembali */}
        <Link
          href="/profile"
          className="block mt-6 text-gray-400 hover:text-gray-300 underline text-sm transition-colors duration-200"
        >
          ← Kembali ke Profil
        </Link>

        {/* Dekorasi latar belakang */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
