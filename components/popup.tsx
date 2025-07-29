import Link from "next/link";
import React from "react";

function PremiumPopup({
  onClose,
  isAuthenticated,
}: {
  onClose: () => void;
  isAuthenticated: boolean;
}) {
  return (
    <div className="fixed mt-10 inset-0 z-100 flex items-center justify-center  p-4">
      <div className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/20 rounded-2xl p-4 sm:p-6 lg:p-8 max-w-xs sm:max-w-md lg:max-w-lg w-full shadow-2xl animate-slideUp overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 animate-pulse opacity-50" />

        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-full blur-xl" />
        <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-xl" />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-400 hover:text-white text-lg sm:text-xl font-light w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-slate-800/50 flex items-center justify-center transition-all duration-200 z-10"
          aria-label="Tutup"
        >
          ×
        </button>

        <div className="relative z-10">
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl border border-indigo-400/30 animate-glow">
                <svg
                  className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 3l14 9-14 9V3z"
                  />
                </svg>
              </div>
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">✦</span>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-1 sm:mb-2">
                Unlock Premium
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-medium">
                Elevate your career journey
              </p>
            </div>
          </div>

          <p className="text-slate-300 text-center mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base px-2 sm:px-0">
            Dapatkan akses eksklusif ke fitur premium dan percepat persiapan
            karir Anda dengan tools yang dirancang khusus untuk kesuksesan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg sm:rounded-xl p-2 sm:p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-slate-300 text-xs sm:text-sm font-medium">
                  Interview AI
                </span>
              </div>
              <p className="text-slate-400 text-xs">Simulasi tanpa batas</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg sm:rounded-xl p-2 sm:p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></div>
                <span className="text-slate-300 text-xs sm:text-sm font-medium">
                  Smart Analytics
                </span>
              </div>
              <p className="text-slate-400 text-xs">Progress tracking</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg sm:rounded-xl p-2 sm:p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full"></div>
                <span className="text-slate-300 text-xs sm:text-sm font-medium">
                  AI Feedback
                </span>
              </div>
              <p className="text-slate-400 text-xs">Personal coaching</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg sm:rounded-xl p-2 sm:p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-300 text-xs sm:text-sm font-medium">
                  Priority Support
                </span>
              </div>
              <p className="text-slate-400 text-xs">24/7 assistance</p>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Link
              href={isAuthenticated ? "/profile/checkout" : "/auth/signin"}
              className="block w-full px-4 py-3 sm:px-6 sm:py-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-indigo-500/30 text-center group relative overflow-hidden text-sm sm:text-base"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Upgrade to Premium</span>
            </Link>

            <button
              onClick={onClose}
              className="block w-full px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 font-medium hover:bg-slate-700/50 transition-all duration-200 text-center text-sm sm:text-base"
            >
              Maybe Later
            </button>
          </div>
        </div>

        <style jsx>{`
          .animate-slideUp {
            animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .animate-glow {
            animation: glow 2s ease-in-out infinite alternate;
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          @keyframes glow {
            from {
              box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
            }
            to {
              box-shadow:
                0 0 30px rgba(147, 51, 234, 0.4),
                0 0 40px rgba(236, 72, 153, 0.2);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default PremiumPopup;
