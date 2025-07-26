import Link from "next/link";
import React from "react";

function DashboardNavbar() {
  return (
    <nav className="relative z-20 w-full backdrop-blur-xl bg-gradient-to-r from-gray-900/80 via-black/80 to-gray-900/80 border-b border-gray-700/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 rounded-xl flex items-center justify-center shadow-md border border-gray-600/30">
            <svg
              className="w-6 h-6 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent select-none">
            Interview Hub
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-5 py-2 rounded-xl font-medium text-sm bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 shadow-md hover:from-gray-600 hover:to-gray-700 border border-gray-600/30 hover:border-gray-500/40 transition-all duration-200 hover:shadow-lg"
          >
            Home
          </Link>
          <Link
            href="/dashboard/interview"
            className="px-5 py-2 rounded-xl font-medium text-sm bg-gradient-to-r from-gray-800 to-black text-gray-200 shadow-md hover:from-gray-700 hover:to-gray-900 border border-gray-600/30 hover:border-gray-500/40 transition-all duration-200 hover:shadow-lg"
          >
            Interviews
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;
