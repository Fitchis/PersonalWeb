import React from "react";

function Footer() {
  return (
    <footer className="relative mt-auto">
      {/* Gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>

      {/* Main footer content */}
      <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-t border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Brand */}
              <div className="flex items-center gap-2 group">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                    <span className="font-bold text-white text-sm">D</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="text-slate-300 font-medium text-sm sm:text-base">
                  Personal Dashboard
                </span>
              </div>

              {/* Copyright */}
              <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
                <span>&copy; 2025</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Built with passion</span>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="mt-6 pt-6 border-t border-slate-700/30">
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-500">System Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-slate-500">
                    Secure Connection
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
    </footer>
  );
}

export default Footer;
