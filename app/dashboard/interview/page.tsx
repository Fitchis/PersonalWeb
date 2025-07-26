import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import AddNewInterview from "@/components/mock-interview/AddNewInterview";
import Link from "next/link";
import Navbar from "../_components/Navbar";

export default async function InterviewDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex flex-col relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Navbar />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="text-center space-y-8 px-6">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-black/50 transform rotate-3 hover:rotate-0 transition-transform duration-300 border border-gray-600/30">
                <svg
                  className="w-12 h-12 text-gray-300"
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
              <div className="absolute -inset-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl blur opacity-10 -z-10"></div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                Akses Terbatas
              </h2>
              <p className="text-gray-400 max-w-md text-lg leading-relaxed">
                Silakan login untuk melihat dashboard interview Anda dan mulai
                persiapan karir yang lebih baik.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { interviews: true },
  });

  // Only allow premium users
  const isPremium = user?.role === "premium" || user?.isPremium === true;
  const totalInterviews = user?.interviews.length || 0;

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex flex-col relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Navbar />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="text-center space-y-8 px-6">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-black/50 transform rotate-3 hover:rotate-0 transition-transform duration-300 border border-yellow-400/30">
                <svg
                  className="w-12 h-12 text-yellow-200"
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
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-2xl blur opacity-10 -z-10"></div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                Fitur Premium
              </h2>
              <p className="text-yellow-100 max-w-md text-lg leading-relaxed">
                Fitur interview hanya tersedia untuk pengguna premium.
                <br />
                Upgrade akun Anda untuk mengakses simulasi interview, latihan
                soal, dan fitur karir eksklusif lainnya.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/profile/upgrade"
                  className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold shadow-lg hover:scale-105 transition-transform duration-200 border border-yellow-400/40"
                >
                  Upgrade ke Premium
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-700/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gray-600/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gray-800/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <div className="relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="backdrop-blur-2xl bg-gradient-to-br from-gray-900/40 via-black/40 to-gray-900/20 border border-gray-700/20 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/5 via-transparent to-gray-700/5 rounded-3xl"></div>

            <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-800 via-gray-700 to-black rounded-2xl flex items-center justify-center shadow-xl border border-gray-600/30">
                      <svg
                        className="w-8 h-8 text-gray-300"
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
                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl blur opacity-20 -z-10"></div>
                  </div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
                    Interview Hub
                  </h1>
                </div>

                <p className="text-gray-400 text-xl leading-relaxed max-w-3xl">
                  Tingkatkan kepercayaan diri dengan platform latihan interview
                  terdepan. Persiapkan diri untuk kesuksesan karir dengan
                  simulasi yang realistis.
                </p>

                <div className="flex flex-wrap items-center gap-8 text-sm">
                  <div className="flex items-center gap-3 bg-green-900/20 border border-green-800/30 rounded-full px-4 py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-medium">
                      {totalInterviews} Interview Aktif
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-blue-900/20 border border-blue-800/30 rounded-full px-4 py-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-400 font-medium">
                      Siap Berlatih
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-purple-900/20 border border-purple-800/30 rounded-full px-4 py-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-purple-400 font-medium">
                      AI-Powered
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <div className="relative">
                  <AddNewInterview />
                  <div className="absolute -inset-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl blur opacity-15 -z-10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        {totalInterviews > 0 ? (
          <div className="space-y-12">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-800/30 to-blue-700/30 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-700/30 rounded-2xl p-8 hover:border-gray-600/40 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase">
                        Total Interview
                      </p>
                      <p className="text-4xl font-bold text-gray-100">
                        {totalInterviews}
                      </p>
                      <p className="text-gray-500 text-xs">Sesi tersimpan</p>
                    </div>
                    <div className="w-16 h-16 bg-gray-800/40 rounded-2xl flex items-center justify-center border border-gray-700/40">
                      <svg
                        className="w-8 h-8 text-gray-400"
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
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-800/30 to-green-700/30 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-700/30 rounded-2xl p-8 hover:border-gray-600/40 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase">
                        Minggu Ini
                      </p>
                      <p className="text-4xl font-bold text-gray-100">
                        {user?.interviews.filter(
                          (i) =>
                            new Date(i.createdAt) >
                            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        ).length || 0}
                      </p>
                      <p className="text-gray-500 text-xs">Interview baru</p>
                    </div>
                    <div className="w-16 h-16 bg-gray-800/40 rounded-2xl flex items-center justify-center border border-gray-700/40">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-800/30 to-purple-700/30 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-700/30 rounded-2xl p-8 hover:border-gray-600/40 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase">
                        Rata-rata Soal
                      </p>
                      <p className="text-4xl font-bold text-gray-100">
                        {totalInterviews > 0 && user
                          ? Math.round(
                              user.interviews.reduce(
                                (acc, i) =>
                                  acc + JSON.parse(i.questionsJson).length,
                                0
                              ) / totalInterviews
                            )
                          : 0}
                      </p>
                      <p className="text-gray-500 text-xs">Per sesi</p>
                    </div>
                    <div className="w-16 h-16 bg-gray-800/40 rounded-2xl flex items-center justify-center border border-gray-700/40">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interview List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Daftar Interview
                </h2>
                <div className="text-sm text-gray-500">
                  {totalInterviews} sesi tersedia
                </div>
              </div>

              <div className="space-y-4">
                {user?.interviews
                  ?.sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((interview, index) => (
                    <div key={interview.id} className="group relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-800/20 via-gray-700/20 to-gray-800/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                      <div className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/40 via-black/40 to-gray-900/20 hover:from-gray-900/60 hover:via-black/60 hover:to-gray-900/40 border border-gray-700/20 hover:border-gray-600/30 rounded-2xl p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1">
                        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
                          <div className="flex items-start gap-6 flex-1">
                            <div className="relative">
                              <div className="w-16 h-16 bg-gradient-to-br from-gray-800 via-gray-700 to-black rounded-2xl flex items-center justify-center shadow-xl border border-gray-600/30">
                                <span className="text-gray-300 font-bold text-lg">
                                  #{index + 1}
                                </span>
                              </div>
                              <div className="absolute -inset-1 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl blur opacity-20 -z-10"></div>
                            </div>

                            <div className="space-y-3 flex-1">
                              <h3 className="text-2xl font-bold text-gray-100 group-hover:text-gray-200 transition-colors duration-300">
                                {interview.jobPosition}
                              </h3>

                              <div className="flex flex-wrap items-center gap-6 text-sm">
                                <div className="flex items-center gap-2 text-gray-400 bg-gray-800/30 rounded-full px-3 py-1.5 border border-gray-700/30">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  {new Date(
                                    interview.createdAt
                                  ).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>

                                <div className="flex items-center gap-2 text-blue-400 bg-blue-900/20 rounded-full px-3 py-1.5 border border-blue-800/30">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  {JSON.parse(interview.questionsJson).length}{" "}
                                  soal
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <Link
                              href={`/dashboard/interview/${interview.id}`}
                              className="group/btn relative overflow-hidden px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-100 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-black/25 hover:scale-105 border border-gray-600/30"
                            >
                              <span className="relative z-10">
                                Mulai Interview
                              </span>
                              <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            </Link>

                            <Link
                              href={`/dashboard/interview/${interview.id}/result`}
                              className="group/btn relative overflow-hidden px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-100 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-black/25 hover:scale-105 border border-gray-700/30"
                            >
                              <span className="relative z-10">Lihat Hasil</span>
                              <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          /* Enhanced Empty State */
          <div className="text-center py-24">
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-gray-800/10 via-gray-700/10 to-gray-800/10 rounded-3xl blur-xl"></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-gray-900/40 via-black/40 to-gray-900/20 border border-gray-700/20 rounded-3xl p-16">
                <div className="relative mb-10">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-800/40 via-gray-700/40 to-black/40 rounded-3xl flex items-center justify-center border border-gray-600/20">
                    <svg
                      className="w-16 h-16 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-3xl blur opacity-5 -z-10"></div>
                </div>

                <div className="space-y-6 mb-12">
                  <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
                    Mulai Perjalanan Interview Anda
                  </h3>
                  <p className="text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto">
                    Belum ada sesi interview yang tersimpan. Mulai persiapan
                    sekarang dan tingkatkan kepercayaan diri untuk meraih karir
                    impian dengan simulasi interview yang realistis.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <div className="relative">
                    <AddNewInterview />
                    <div className="absolute -inset-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl blur opacity-15 -z-10"></div>
                  </div>

                  <button className="group relative overflow-hidden px-8 py-3 border border-gray-600/30 hover:border-gray-500/40 text-gray-300 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-800/20 hover:shadow-lg">
                    <span className="relative z-10 flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Pelajari Tips Interview
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
