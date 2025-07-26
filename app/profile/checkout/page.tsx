import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex flex-col relative overflow-hidden">
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="max-w-lg w-full mx-auto bg-gradient-to-br from-yellow-900/40 via-black/40 to-yellow-900/20 border border-yellow-700/30 rounded-3xl p-10 shadow-2xl text-center space-y-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent mb-4">
            Pembayaran Premium
          </h1>
          <p className="text-yellow-100 text-lg leading-relaxed mb-4">
            Silakan lanjutkan pembayaran untuk mengaktifkan akun premium Anda.
          </p>
          <div className="bg-yellow-800/20 border border-yellow-700/30 rounded-xl p-6 text-yellow-200 text-left mb-6">
            <div className="flex justify-between items-center mb-2">
              <span>Paket Premium</span>
              <span className="font-bold text-yellow-300 text-xl">
                Rp 15.000
              </span>
            </div>
            <div className="text-sm text-yellow-300/80">
              Akses penuh fitur interview, latihan soal, statistik, dan dukungan
              prioritas selama 1 tahun.
            </div>
          </div>
          {/* Tombol bayar Tripay */}
          <form
            method="POST"
            action="/api/tripay/checkout"
            className="space-y-4"
          >
            <button
              type="submit"
              className="w-full px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold shadow-lg hover:scale-105 transition-transform duration-200 border border-yellow-400/40"
            >
              Bayar dengan Tripay
            </button>
          </form>
          <Link
            href="/profile/upgrade"
            className="block text-yellow-300/80 hover:text-yellow-200 underline text-sm mt-4"
          >
            Kembali
          </Link>
        </div>
      </div>
    </div>
  );
}
