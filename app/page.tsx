"use client";
import PremiumPopup from "../components/popup";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import TodoList from "../components/todo/TodoList";
import JobApplicationList from "../components/job/JobApplicationList";
import Navbar from "../components/layout/Navbar";
import Header from "../components/layout/Header";
import { RequireAuth } from "../components/RequireAuth";
import DashboardWidgets from "../components/widgets/DashboardWidgets";
import WidgetSettingsPanel from "../components/widgets/WidgetSettingsPanel";
import StatsSection from "../components/stats/StatsSection";
import HowToUsePopup from "@/components/HowToUsePopup";
import dynamic from "next/dynamic";
const AIChatWidget = dynamic(() => import("../components/AIChatWidget"), {
  ssr: false,
});
import { Gamepad } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  // Widget customization state
  const [showCustomize, setShowCustomize] = useState(false);
  const [widgetPrefs, setWidgetPrefs] = useState({
    quote: true,
    calendar: true,
    music: true,
    pomodoro: true,
  });
  const [hasMounted, setHasMounted] = useState(false);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);

  // Popup premium hanya muncul untuk user non-premium dan hanya sekali (per device)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("premiumPopupDismissed");
      // Cek status premium dari session jika sudah login
      const isPremium =
        status === "authenticated" &&
        typeof session?.user === "object" &&
        session?.user &&
        "isPremium" in session.user &&
        (session.user as { isPremium?: boolean }).isPremium === true;
      if (!dismissed && !isPremium) setShowPremiumPopup(true);
    }
  }, [status, session]);

  const handleClosePremiumPopup = () => {
    setShowPremiumPopup(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("premiumPopupDismissed", "1");
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboardWidgetPrefs");
      if (saved) {
        // Add pomodoro default if missing (for backward compatibility)
        const parsed = JSON.parse(saved);
        setWidgetPrefs({
          quote: parsed.quote !== undefined ? parsed.quote : true,
          calendar: parsed.calendar !== undefined ? parsed.calendar : true,
          music: parsed.music !== undefined ? parsed.music : true,
          pomodoro: parsed.pomodoro !== undefined ? parsed.pomodoro : true,
        });
      }
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboardWidgetPrefs", JSON.stringify(widgetPrefs));
    }
  }, [widgetPrefs]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <main className="min-h-screen bg-black text-white relative overflow-hidden">
        {showPremiumPopup && <PremiumPopup onClose={handleClosePremiumPopup} />}
        {/* How to Use Popup */}
        <HowToUsePopup localStorageKey="howToUsePopupDismissed" />
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(156,163,175,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(107,114,128,0.08),transparent_50%)]"></div>

        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:50px_50px] animate-pulse"></div>
        </div>

        {/* Navbar */}
        <Navbar scrollToSection={scrollToSection} />

        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          {/* Header */}
          <Header scrollToSection={scrollToSection} />

          {/*  Widgets */}
          <section id="widgets" className="mb-12">
            <div className="max-w-6xl mx-auto">
              {/* Inline Header */}
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-2">
                  <Gamepad className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-xl font-semibold text-gray-200">
                    Widgets
                  </h2>
                </div>

                {status === "authenticated" && (
                  <button
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 rounded-md border border-gray-600 hover:border-indigo-500 transition-colors duration-200 text-sm flex items-center gap-1.5"
                    onClick={() => setShowCustomize((v) => !v)}
                  >
                    ⚙️ Settings
                  </button>
                )}
              </div>

              {/* Slide-down Settings Panel */}
              {hasMounted && (
                <WidgetSettingsPanel
                  show={showCustomize}
                  onClose={() => setShowCustomize(false)}
                  widgetPrefs={widgetPrefs}
                  setWidgetPrefs={setWidgetPrefs}
                />
              )}

              {/* Compact Widget Grid */}
              {hasMounted && <DashboardWidgets widgetPrefs={widgetPrefs} />}
            </div>
          </section>

          {/* Todo Section */}
          <section id="todo" className="mb-16 scroll-mt-20">
            <div className="flex items-center mb-8">
              <div className="text-3xl mr-4">📝</div>
              <h2 className="text-3xl font-semibold text-white">Todo List</h2>
              <div className="ml-4 px-3 py-1 bg-gray-700/40 text-gray-300 rounded-full text-sm font-medium border border-gray-600">
                Task Management
              </div>
            </div>
            <div>
              <RequireAuth
                preview={
                  <div className="rounded-xl bg-gray-800/60 border border-gray-700 p-6 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                    <div className="w-full h-8 bg-gray-700/60 rounded mb-2 animate-pulse" />
                    <div className="w-3/4 h-4 bg-gray-700/40 rounded mb-2 animate-pulse" />
                    <div className="w-1/2 h-4 bg-gray-700/30 rounded mb-4 animate-pulse" />
                    <div className="text-gray-400 text-center text-sm">
                      Please log in to manage and view your todo list.
                      <br />
                      <span className="italic text-gray-500">
                        (Feature preview: tasks, deadlines, drag & drop, and
                        more)
                      </span>
                    </div>
                  </div>
                }
              >
                <TodoList />
              </RequireAuth>
            </div>
            {status === "authenticated" && (
              <div className="mt-10 flex justify-center">
                <Link
                  href="/dashboard/interview"
                  className="group relative flex items-center gap-4 px-8 py-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-semibold text-lg shadow-2xl hover:shadow-slate-500/25 border border-slate-700/50 hover:border-slate-600/80 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
                >
                  {/* Animated background glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

                  {/* Main content */}
                  <div className="relative z-10 flex items-center gap-4">
                    {/* Icon with subtle animation */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>

                    {/* Text content */}
                    <div className="flex flex-col">
                      <span className="text-white font-semibold">
                        Dashboard Interview
                      </span>
                      <span className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-200">
                        Start your session
                      </span>
                    </div>

                    {/* Arrow indicator */}
                    <div className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 group-hover:translate-x-2 transition-all duration-300">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute top-1 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
                  </div>
                </Link>
              </div>
            )}
          </section>

          {/* Job Applications Section */}
          <section id="job" className="mb-16 scroll-mt-20">
            <div className="flex items-center mb-8">
              <div className="text-3xl mr-4">💼</div>
              <h2 className="text-3xl font-semibold text-white">
                Job Applications
              </h2>
              <div className="ml-4 px-3 py-1 bg-gray-700/40 text-gray-300 rounded-full text-sm font-medium border border-gray-600">
                Career Tracking
              </div>
            </div>
            <div>
              <RequireAuth
                preview={
                  <div className="rounded-xl bg-gray-800/60 border border-gray-700 p-6 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                    <div className="w-full h-8 bg-gray-700/60 rounded mb-2 animate-pulse" />
                    <div className="w-3/4 h-4 bg-gray-700/40 rounded mb-2 animate-pulse" />
                    <div className="w-1/2 h-4 bg-gray-700/30 rounded mb-4 animate-pulse" />
                    <div className="text-gray-400 text-center text-sm">
                      Please log in to view and track your job applications.
                      <br />
                      <span className="italic text-gray-500">
                        (Feature preview: application status, notes, and more)
                      </span>
                    </div>
                  </div>
                }
              >
                <JobApplicationList />
              </RequireAuth>
            </div>
          </section>

          {/* Stats Section */}
          <section className="mb-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800/10 via-gray-700/10 to-gray-600/10 rounded-3xl blur-2xl"></div>
              <div className="relative">
                <RequireAuth
                  preview={
                    <div className="rounded-xl bg-gray-800/60 border border-gray-700 p-6 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                      <div className="w-full h-8 bg-gray-700/60 rounded mb-2 animate-pulse" />
                      <div className="w-3/4 h-4 bg-gray-700/40 rounded mb-2 animate-pulse" />
                      <div className="w-1/2 h-4 bg-gray-700/30 rounded mb-4 animate-pulse" />
                      <div className="text-gray-400 text-center text-sm">
                        Please log in to view your statistics.
                        <br />
                        <span className="italic text-gray-500">
                          (Feature preview: productivity stats, charts, and
                          more)
                        </span>
                      </div>
                    </div>
                  }
                >
                  <StatsSection />
                </RequireAuth>
              </div>
            </div>
          </section>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-gray-500 rounded-full opacity-30 animate-pulse"></div>
        <div
          className="absolute top-1/2 right-20 w-1 h-1 bg-gray-400 rounded-full opacity-40 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-gray-600 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-gray-500 rounded-full opacity-30 animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>

        <AIChatWidget />
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .hover\\:shadow-3xl:hover {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}
