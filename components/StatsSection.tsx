"use client";
import React, { useEffect, useState } from "react";

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
  const [todos, setTodos] = useState<Todo[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [todoRes, jobRes] = await Promise.all([
        fetch("/api/todos"),
        fetch("/api/jobs"),
      ]);
      const todos = todoRes.ok ? await todoRes.json() : [];
      const jobs = jobRes.ok ? await jobRes.json() : [];
      setTodos(todos);
      setApplications(jobs);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Stats
  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.done).length;
  const productivity =
    totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);
  const totalApps = applications.length;
  const accepted = applications.filter((a) => a.status === "accept").length;
  const rejected = applications.filter((a) => a.status === "reject").length;
  const pending = applications.filter((a) => a.status === "pending").length;
  // Streak: hitung hari berturut-turut ada todo selesai
  function getStreak() {
    if (!todos.length) return 0;
    const doneDates = todos
      .filter((t) => t.done && t.deadline)
      .map((t) => new Date(t.deadline!).toDateString());
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
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-6 border border-blue-700/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-400 font-semibold text-sm uppercase tracking-wide">
                Productivity
              </h3>
              <p className="text-2xl font-bold text-white mt-1">
                {loading ? "..." : productivity + "%"}
              </p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-700/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-purple-400 font-semibold text-sm uppercase tracking-wide">
                Applications
              </h3>
              <p className="text-2xl font-bold text-white mt-1">
                {loading ? "..." : totalApps}
              </p>
              <div className="flex gap-2 mt-2 text-xs">
                <span className="text-green-400">✓ {accepted}</span>
                <span className="text-yellow-400">⏳ {pending}</span>
                <span className="text-red-400">✗ {rejected}</span>
              </div>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 rounded-xl p-6 border border-cyan-700/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-cyan-400 font-semibold text-sm uppercase tracking-wide">
                Streak
              </h3>
              <p className="text-2xl font-bold text-white mt-1">
                {loading ? "..." : streak + " Days"}
              </p>
            </div>
            <div className="text-3xl">🔥</div>
          </div>
        </div>
      </div>
    </section>
  );
}
