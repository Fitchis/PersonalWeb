"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  ChevronDown,
  Sparkles,
  BarChart3,
  CheckSquare,
  Play,
} from "lucide-react";

// Hydration-safe floating particles
function FloatingParticles() {
  const [mounted, setMounted] = useState(false);
  const particles = useMemo(() => {
    return Array.from({ length: 6 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
  }, []);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce opacity-20"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Header({
  scrollToSection,
}: {
  scrollToSection: (sectionId: string) => void;
}) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, [currentTime, mounted]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <header id="home" className="text-center mb-16 relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-gray-900/10 rounded-3xl blur-3xl -z-10 animate-pulse"></div>

      {/* Floating particles effect (hydration-safe) */}
      <FloatingParticles />

      <div className="relative">
        {/* Time and greeting (client-only) */}
        {mounted && (
          <div className="mb-6 space-y-2">
            <div className="text-2xl font-bold text-blue-400 font-mono">
              {formatTime(currentTime)}
            </div>
            <div className="text-gray-400 text-sm">
              {formatDate(currentTime)}
            </div>
            <div className="text-lg text-gray-300 font-medium">
              {greeting},{" "}
              <span className="font-bold text-blue-300">
                {session?.user?.name || "User"}
              </span>
              ! 👋
            </div>
          </div>
        )}

        {/* Main title */}
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
          Task2Work
        </h1>

        {/* Decorative line */}
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full shadow-lg shadow-blue-500/50"></div>

        {/* Subtitle */}
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-4">
          Manage your tasks and track your job applications all in one place
        </p>

        {/* Stats preview */}
        <div className="flex justify-center gap-6 mb-8 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <CheckSquare className="h-4 w-4" />
            <span>Tasks</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>Productivity</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => scrollToSection("widgets")}
          className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 border border-blue-500/50 hover:border-blue-400 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative flex items-center justify-center gap-2">
            <Play className="h-5 w-5" />
            Get Started
          </span>
        </button>

        <button
          onClick={() => scrollToSection("todo")}
          className="group px-8 py-4 bg-gray-900/60 text-white rounded-xl font-semibold hover:bg-gray-800/80 border border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative flex items-center justify-center gap-2">
            <CheckSquare className="h-5 w-5" />
            View Tasks
          </span>
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="mt-12 animate-bounce">
        <ChevronDown className="h-6 w-6 text-gray-500 mx-auto" />
      </div>
    </header>
  );
}
