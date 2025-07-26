import Link from "next/link";
import Navbar from "../../profile/upgrade/_components/Navbar";

export default function UpgradeProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex flex-col relative overflow-hidden">
      <Navbar />
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="max-w-lg w-full mx-auto bg-gradient-to-br from-yellow-900/40 via-black/40 to-yellow-900/20 border border-yellow-700/30 rounded-3xl p-10 shadow-2xl text-center space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-300 rounded-full flex items-center justify-center shadow-xl border border-yellow-400/30">
              <svg
                className="w-10 h-10 text-yellow-100"
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
              Upgrade ke Premium
            </h1>
          </div>
          <p className="text-yellow-100 text-lg leading-relaxed">
            Dapatkan akses penuh ke fitur interview, latihan soal, dan tools
            karir eksklusif lainnya. Jadilah pengguna premium dan maksimalkan
            persiapan karir Anda!
          </p>
          <ul className="text-left text-yellow-200/90 space-y-2 mx-auto max-w-xs text-base">
            <li>✔️ Simulasi interview tanpa batas</li>
            <li>✔️ Latihan soal AI & feedback</li>
            <li>✔️ Statistik & progress karir</li>
            <li>✔️ Dukungan prioritas</li>
          </ul>
          <Link
            href="/profile/checkout"
            className="block w-full px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold shadow-lg hover:scale-105 transition-transform duration-200 border border-yellow-400/40 text-center"
          >
            Upgrade Sekarang
          </Link>
          <Link
            href="/profile"
            className="block text-yellow-300/80 hover:text-yellow-200 underline text-sm mt-4"
          >
            Kembali ke Profil
          </Link>
        </div>
      </div>
    </div>
  );
}
