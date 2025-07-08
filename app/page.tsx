"use client";
import React from "react";
import dynamic from "next/dynamic";
const MusicPlayer = dynamic(() => import("../components/MusicPlayer"), {
  ssr: false,
});
import TodoList from "../components/TodoList";
import JobApplicationList from "../components/JobApplicationList";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { RequireAuth } from "../components/RequireAuth";
import MotivationalQuoteWidget from "../components/MotivationalQuoteWidget";
import MiniCalendarWidget from "../components/MiniCalendarWidget";
import StatsSection from "../components/StatsSection";
// import Footer from "@/components/Footer";

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
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

        {/* Motivational Quote & Mini Calendar Widgets */}
        <section id="widgets" className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="text-3xl mr-4">✨</div>
            <h2 className="text-3xl font-semibold text-white">
              Quick Insights
            </h2>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4 flex flex-col h-full shadow-lg border border-gray-700 min-h-[180px]">
                <MotivationalQuoteWidget />
              </div>
              <div className="rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4 flex flex-col h-full shadow-lg border border-gray-700 min-h-[180px]">
                <MiniCalendarWidget />
              </div>
              <div className="rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4 flex flex-col h-full shadow-lg border border-gray-700 min-h-[180px]">
                <MusicPlayer />
              </div>
            </div>
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
            <RequireAuth>
              <TodoList />
            </RequireAuth>
          </div>
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
            <RequireAuth>
              <JobApplicationList />
            </RequireAuth>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800/10 via-gray-700/10 to-gray-600/10 rounded-3xl blur-2xl"></div>
            <div className="relative">
              <StatsSection />
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
  );
}
