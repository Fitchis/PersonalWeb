"use client";
import React from "react";
import TodoList from "../components/TodoList";
import JobApplicationList from "../components/JobApplicationList";
import AuthButton from "../components/AuthButton";
import { RequireAuth } from "../components/RequireAuth";
import MotivationalQuoteWidget from "../components/MotivationalQuoteWidget";
import MiniCalendarWidget from "../components/MiniCalendarWidget";
import StatsSection from "../components/StatsSection";
import Footer from "@/components/Footer";

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
      <nav className="w-full bg-black/80 border-b border-gray-800/50 shadow-2xl sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-y-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center shadow-lg border border-gray-600">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent select-none">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-end">
            <button
              onClick={() => scrollToSection("todo")}
              className="text-gray-400 hover:text-white font-medium transition-all duration-200 hover:scale-105 transform text-xs sm:text-base px-2 sm:px-0 relative group"
            >
              Todo
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-400 transition-all duration-200 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => scrollToSection("job")}
              className="text-gray-400 hover:text-white font-medium transition-all duration-200 hover:scale-105 transform text-xs sm:text-base px-2 sm:px-0 relative group"
            >
              Job
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-400 transition-all duration-200 group-hover:w-full"></span>
            </button>
            <a
              href="/profile"
              className="text-gray-400 hover:text-white font-medium transition-all duration-200 hover:scale-105 transform text-xs sm:text-base px-2 sm:px-0 relative group"
            >
              Profil
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-400 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <div className="ml-auto sm:ml-0">
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <header className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 via-gray-700/20 to-gray-600/20 rounded-3xl blur-3xl -z-10"></div>
          <div className="relative">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
              Personal Dashboard
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-600 to-gray-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Manage your tasks and track your job applications all in one place
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => scrollToSection("widgets")}
              className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105 border border-gray-600"
            >
              Get Started
            </button>
            <button
              onClick={() => scrollToSection("todo")}
              className="px-8 py-4 bg-gray-900/60 text-white rounded-xl font-semibold hover:bg-gray-800/80 border border-gray-700 hover:border-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              View Tasks
            </button>
          </div>
        </header>

        {/* Motivational Quote & Mini Calendar Widgets */}
        <section id="widgets" className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="text-3xl mr-4">✨</div>
            <h2 className="text-3xl font-semibold text-white">
              Quick Insights
            </h2>
          </div>
          <div className="flex flex-col gap-6 max-w-2xl mx-auto sm:grid sm:grid-cols-2 sm:gap-6">
            <div className="transform hover:scale-105 transition-transform duration-200 w-full">
              <MotivationalQuoteWidget />
            </div>
            <div className="transform hover:scale-105 transition-transform duration-200 w-full">
              <MiniCalendarWidget />
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
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-gray-600/70 hover:bg-gray-800/70">
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
              Lamaran Pekerjaan
            </h2>
            <div className="ml-4 px-3 py-1 bg-gray-700/40 text-gray-300 rounded-full text-sm font-medium border border-gray-600">
              Career Tracking
            </div>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-gray-600/70 hover:bg-gray-800/70">
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

        {/* Footer */}
        <Footer />
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
