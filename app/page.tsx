"use client";
import React from "react";
import TodoList from "../components/TodoList";
import JobApplicationList from "../components/JobApplicationList";
import AuthButton from "../components/AuthButton";
import { RequireAuth } from "../components/RequireAuth";
import MotivationalQuoteWidget from "../components/MotivationalQuoteWidget";
import MiniCalendarWidget from "../components/MiniCalendarWidget";
import StatsSection from "../components/StatsSection";

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="w-full bg-gray-950/90 border-b border-gray-800 shadow-lg sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent select-none">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => scrollToSection("todo")}
              className="text-gray-300 hover:text-cyan-400 font-medium transition-colors duration-200 hover:scale-105 transform"
            >
              Todo
            </button>
            <button
              onClick={() => scrollToSection("job")}
              className="text-gray-300 hover:text-cyan-400 font-medium transition-colors duration-200 hover:scale-105 transform"
            >
              Job
            </button>
            <a
              href="/profile"
              className="text-gray-300 hover:text-cyan-400 font-medium transition-colors duration-200 hover:scale-105 transform"
            >
              Profil
            </a>
            <AuthButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur-3xl -z-10"></div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent relative z-10">
            Personal Dashboard
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Manage your tasks and track your job applications all in one place
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => scrollToSection("widgets")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={() => scrollToSection("todo")}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="transform hover:scale-105 transition-transform duration-200">
              <MotivationalQuoteWidget />
            </div>
            <div className="transform hover:scale-105 transition-transform duration-200">
              <MiniCalendarWidget />
            </div>
          </div>
        </section>

        {/* Todo Section */}
        <section id="todo" className="mb-16 scroll-mt-20">
          <div className="flex items-center mb-8">
            <div className="text-3xl mr-4">📝</div>
            <h2 className="text-3xl font-semibold text-white">Todo List</h2>
            <div className="ml-4 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium">
              Task Management
            </div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:border-gray-600">
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
            <div className="ml-4 px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm font-medium">
              Career Tracking
            </div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:border-gray-600">
            <RequireAuth>
              <JobApplicationList />
            </RequireAuth>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection />

        {/* Footer */}
        <footer className="text-center mt-16 py-8 border-t border-gray-800">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">D</span>
            </div>
            <span className="text-gray-400 font-medium">
              Personal Dashboard
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Built with React & Tailwind CSS • Dark Theme • © 2025
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-400 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-400 transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-400 transition-colors"
            >
              Support
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
