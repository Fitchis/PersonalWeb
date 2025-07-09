"use client";
import React from "react";
import CountUp from "react-countup";
import useSWR from "swr";

interface Todo {
  id: number;
  text: string;
  done: boolean;
  deadline?: string | null;
}
interface JobApplication {
  id: number;
  company: string;
  position: string;
  status: "accept" | "reject" | "pending";
}

export default function StatsSection() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: todos = [], isLoading: loadingTodos } = useSWR<Todo[]>(
    "/api/todos",
    fetcher,
    { refreshInterval: 0 }
  );
  const { data: applications = [], isLoading: loadingApps } = useSWR<
    JobApplication[]
  >("/api/jobs", fetcher, { refreshInterval: 0 });
  const loading = loadingTodos || loadingApps;

  // Stats
  const totalTodos = todos.length;
  const completedTodos = (todos as Todo[]).filter((t: Todo) => t.done).length;
  const productivity =
    totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);
  const totalApps = applications.length;
  const accepted = (applications as JobApplication[]).filter(
    (a: JobApplication) => a.status === "accept"
  ).length;
  const rejected = (applications as JobApplication[]).filter(
    (a: JobApplication) => a.status === "reject"
  ).length;
  const pending = (applications as JobApplication[]).filter(
    (a: JobApplication) => a.status === "pending"
  ).length;
  // Streak: hitung hari berturut-turut ada todo selesai
  function getStreak() {
    if (!todos.length) return 0;
    const doneDates = (todos as Todo[])
      .filter((t: Todo) => t.done && t.deadline)
      .map((t: Todo) => new Date(t.deadline!).toDateString());
    const uniqueDates = Array.from(new Set(doneDates));
    let streak = 0;
    const current = new Date();
    while (uniqueDates.includes(current.toDateString())) {
      streak++;
      current.setDate(current.getDate() - 1);
    }
    return streak;
  }
  const streak = getStreak();

  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Productivity Card */}
        <div
          className="rounded-2xl p-6 border border-gray-700/60 bg-gray-900/70 shadow-xl hover:shadow-2xl transition-all duration-200 hover:border-gray-500/80 hover:bg-gray-800/80 backdrop-blur-md cursor-help"
          title="Shows your completed todos as a percentage of all todos."
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1 cursor-help"
                title="Shows your completed todos as a percentage of all todos."
              >
                Productivity
              </h3>
              <p className="text-3xl font-extrabold text-white mt-1 drop-shadow-lg min-h-[2.5rem]">
                {loading ? (
                  <span className="inline-block w-16 h-7 bg-gray-800/60 rounded animate-pulse" />
                ) : (
                  <CountUp end={productivity} duration={0.8} suffix="%" />
                )}
              </p>
            </div>
            <div className="text-4xl bg-cyan-900/40 rounded-full p-2 border border-cyan-700/40 shadow-inner">
              📈
            </div>
          </div>
        </div>
        {/* Applications Card */}
        <div
          className="rounded-2xl p-6 border border-gray-700/60 bg-gray-900/70 shadow-xl hover:shadow-2xl transition-all duration-200 hover:border-gray-500/80 hover:bg-gray-800/80 backdrop-blur-md cursor-help"
          title="Total job applications and their status breakdown."
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="text-purple-400 font-semibold text-xs uppercase tracking-wider mb-1 cursor-help"
                title="Total job applications and their status breakdown."
              >
                Applications
              </h3>
              <p className="text-3xl font-extrabold text-white mt-1 drop-shadow-lg min-h-[2.5rem]">
                {loading ? (
                  <span className="inline-block w-12 h-7 bg-gray-800/60 rounded animate-pulse" />
                ) : (
                  <CountUp end={totalApps} duration={0.8} />
                )}
              </p>
              <div className="flex gap-2 mt-2 text-xs">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-900/30 text-green-300 border border-green-700/40"
                  title="Accepted"
                >
                  <span>✓</span>
                  {loading ? (
                    <span className="inline-block w-4 h-4 bg-gray-800/60 rounded animate-pulse" />
                  ) : (
                    <CountUp end={accepted} duration={0.8} />
                  )}
                </span>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-900/30 text-yellow-300 border border-yellow-700/40"
                  title="Pending"
                >
                  <span>⏳</span>
                  {loading ? (
                    <span className="inline-block w-4 h-4 bg-gray-800/60 rounded animate-pulse" />
                  ) : (
                    <CountUp end={pending} duration={0.8} />
                  )}
                </span>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-900/30 text-red-300 border border-red-700/40"
                  title="Rejected"
                >
                  <span>✗</span>
                  {loading ? (
                    <span className="inline-block w-4 h-4 bg-gray-800/60 rounded animate-pulse" />
                  ) : (
                    <CountUp end={rejected} duration={0.8} />
                  )}
                </span>
              </div>
            </div>
            <div className="text-4xl bg-purple-900/40 rounded-full p-2 border border-purple-700/40 shadow-inner">
              🎯
            </div>
          </div>
        </div>
        {/* Streak Card */}
        <div
          className="rounded-2xl p-6 border border-gray-700/60 bg-gray-900/70 shadow-xl hover:shadow-2xl transition-all duration-200 hover:border-gray-500/80 hover:bg-gray-800/80 backdrop-blur-md cursor-help"
          title="Number of consecutive days you completed at least one todo."
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1 cursor-help"
                title="Number of consecutive days you completed at least one todo."
              >
                Streak
              </h3>
              <p className="text-3xl font-extrabold text-white mt-1 drop-shadow-lg min-h-[2.5rem]">
                {loading ? (
                  <span className="inline-block w-12 h-7 bg-gray-800/60 rounded animate-pulse" />
                ) : (
                  <CountUp end={streak} duration={0.8} />
                )}{" "}
                <span className="text-base font-semibold text-cyan-300">
                  Days
                </span>
              </p>
            </div>
            <div className="text-4xl bg-orange-900/40 rounded-full p-2 border border-orange-700/40 shadow-inner">
              🔥
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
