import React from "react";

function PremiumPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-yellow-900/80 via-black/90 to-yellow-900/60 border border-yellow-700/40 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-yellow-200 hover:text-yellow-400 text-2xl font-bold focus:outline-none"
          aria-label="Tutup"
        >
          ×
        </button>
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-300 rounded-full flex items-center justify-center shadow-xl border border-yellow-400/30">
            <svg
              className="w-8 h-8 text-yellow-100"
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
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
            Upgrade ke Premium
          </h2>
        </div>
        <p className="text-yellow-100 text-base mb-4">
          Dapatkan akses penuh ke fitur interview, latihan soal, statistik, dan
          tools karir eksklusif lainnya. Jadilah pengguna premium dan
          maksimalkan persiapan karir Anda!
        </p>
        <ul className="text-left text-yellow-200/90 space-y-1 mx-auto max-w-xs text-sm mb-4">
          <li>✔️ Simulasi interview tanpa batas</li>
          <li>✔️ Latihan soal AI & feedback</li>
          <li>✔️ Statistik & progress karir</li>
          <li>✔️ Dukungan prioritas</li>
        </ul>
        <a
          href="/profile/upgrade"
          className="inline-block w-full px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold shadow-lg hover:scale-105 transition-transform duration-200 border border-yellow-400/40 text-center mb-2"
        >
          Upgrade Sekarang
        </a>
        <div className="text-yellow-300/80 text-xs">
          Tutup popup ini jika tidak ingin upgrade sekarang.
        </div>
      </div>
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default PremiumPopup;
