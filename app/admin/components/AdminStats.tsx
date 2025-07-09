import React from "react";

type AdminStatsProps = {
  users: Array<{
    emailVerified?: string | null;
    role: string;
  }>;
};

const AdminStats: React.FC<AdminStatsProps> = ({ users }) => {
  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: (
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      gradient: "from-violet-500 via-purple-500 to-blue-500",
      bgGradient: "from-violet-500/10 via-purple-500/10 to-blue-500/10",
      borderGradient: "from-violet-500/20 via-purple-500/20 to-blue-500/20",
      glowColor: "shadow-violet-500/20",
    },
    {
      title: "Verified Users",
      value: users.filter((u) => u.emailVerified).length,
      icon: (
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      bgGradient: "from-emerald-500/10 via-green-500/10 to-teal-500/10",
      borderGradient: "from-emerald-500/20 via-green-500/20 to-teal-500/20",
      glowColor: "shadow-emerald-500/20",
    },
    {
      title: "Admin Users",
      value: users.filter((u) => u.role === "ADMIN").length,
      icon: (
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      gradient: "from-rose-500 via-pink-500 to-red-500",
      bgGradient: "from-rose-500/10 via-pink-500/10 to-red-500/10",
      borderGradient: "from-rose-500/20 via-pink-500/20 to-red-500/20",
      glowColor: "shadow-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`group relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl border border-slate-700/30 rounded-3xl p-8 shadow-2xl hover:shadow-3xl ${stat.glowColor} transition-all duration-500 hover:scale-105 hover:rotate-1`}
        >
          {/* Animated background gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
          ></div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`absolute top-2 right-2 w-2 h-2 bg-gradient-to-r ${stat.gradient} rounded-full animate-ping`}
            ></div>
            <div
              className={`absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r ${stat.gradient} rounded-full animate-pulse`}
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className={`absolute top-1/2 left-2 w-1.5 h-1.5 bg-gradient-to-r ${stat.gradient} rounded-full animate-bounce`}
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.gradient} animate-pulse`}
                ></div>
                <p className="text-slate-300 font-semibold text-sm tracking-wider uppercase">
                  {stat.title}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-5xl font-black text-white tracking-tight">
                  {stat.value}
                </p>
                <div
                  className={`h-1 w-16 bg-gradient-to-r ${stat.gradient} rounded-full`}
                ></div>
              </div>
            </div>

            <div className="relative">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
              ></div>
              <div
                className={`relative w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}
              >
                {stat.icon}
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
