"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  ChevronDown,
  Sparkles,
  BarChart3,
  CheckSquare,
  Zap,
  Rocket,
} from "lucide-react";

// Subtle floating particles
function FloatingParticles() {
  const [mounted, setMounted] = useState(false);

  const particles = useMemo(() => {
    return Array.from({ length: 8 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 2,
      size: Math.random() * 3 + 2,
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
          className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-bounce"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
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
      {/* Dark animated background */}

      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black/30 to-gray-900/50 rounded-3xl blur-2xl -z-10 animate-fade-in"></div>

      {/* Animated glow effect */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

      {/* Animated floating particles */}
      <FloatingParticles />

      {/* Animated shooting star */}
      <div className="hidden md:block absolute top-12 left-1/4 w-32 h-1 pointer-events-none -z-10">
        <div className="w-full h-full animate-shooting-star bg-gradient-to-r from-white/80 via-blue-400/60 to-transparent rounded-full blur-sm opacity-70"></div>
      </div>

      {/* Animated sparkles */}
      <div className="absolute right-10 top-16 animate-float-sparkle z-0">
        <Rocket className="w-8 h-8 text-cyan-300/60 drop-shadow-lg animate-spin-slow" />
      </div>

      <div className="relative py-12">
        {/* Compact time and greeting */}
        {mounted && (
          <div className="mb-8 space-y-3">
            <div className="inline-block bg-black/40 backdrop-blur-xl border border-gray-800/60 rounded-xl px-4 py-2 shadow-xl">
              <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-mono">
                {formatTime(currentTime)}
              </div>
            </div>
            <div className="text-gray-500 text-sm">
              {formatDate(currentTime)}
            </div>
            <div className="text-lg text-gray-300">
              {greeting},{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                {session?.user?.name || "User"}
              </span>
              <span className="ml-1">👋</span>
            </div>
          </div>
        )}

        {/* Main title - more compact */}

        <div className="mb-8 relative animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl font-black mb-4 leading-tight animate-gradient-move">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Task2Work
            </span>
          </h1>

          {/* Animated underline */}
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full shadow-lg shadow-blue-500/30 animate-underline-glow"></div>
        </div>

        {/* Compact subtitle */}

        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8 animate-fade-in-delay">
          <span className="inline-block animate-wiggle"></span> Streamline your
          productivity with intelligent task management and job tracking{" "}
          <span className="inline-block animate-wiggle-reverse">🚀</span>
        </p>

        {/* Compact feature highlights */}
        <div className="flex justify-center gap-8 mb-10 text-sm text-gray-500 animate-fade-in-delay2">
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm border border-gray-800/40 rounded-lg px-3 py-2">
            <CheckSquare className="h-4 w-4 text-blue-400" />
            <span>Smart Tasks</span>
          </div>
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm border border-gray-800/40 rounded-lg px-3 py-2">
            <BarChart3 className="h-4 w-4 text-purple-400" />
            <span>Analytics</span>
          </div>
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm border border-gray-800/40 rounded-lg px-3 py-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Insights</span>
          </div>
        </div>

        {/* Compact action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 animate-fade-in-delay3">
          <button
            onClick={() => scrollToSection("widgets")}
            className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 border border-blue-500/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative flex items-center justify-center gap-2">
              <Zap className="h-4 w-4" />
              Get Started
            </span>
          </button>

          <button
            onClick={() => scrollToSection("todo")}
            className="group px-8 py-3 bg-black/40 text-white rounded-xl font-semibold hover:bg-black/60 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center gap-2">
              <CheckSquare className="h-4 w-4" />
              View Tasks
            </span>
          </button>
        </div>

        {/* Subtle scroll indicator */}
        <div className="animate-bounce animate-fade-in-delay4">
          <div className="bg-black/30 backdrop-blur-sm border border-gray-800/50 rounded-full p-2 mx-auto w-fit hover:border-gray-700/70 transition-all duration-300">
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 1.2s ease;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fade-in-delay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in-delay {
          animation: fade-in-delay 1.2s 0.5s both;
        }
        .animate-fade-in-delay2 {
          animation: fade-in-delay 1.2s 0.8s both;
        }
        .animate-fade-in-delay3 {
          animation: fade-in-delay 1.2s 1.1s both;
        }
        .animate-fade-in-delay4 {
          animation: fade-in-delay 1.2s 1.4s both;
        }
        @keyframes gradient-move {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-move span {
          background-size: 200% 200%;
          animation: gradient-move 3s linear infinite alternate;
        }
        @keyframes underline-glow {
          0%,
          100% {
            box-shadow:
              0 0 16px 2px #6366f1,
              0 0 0 #fff0;
          }
          50% {
            box-shadow:
              0 0 32px 8px #a78bfa,
              0 0 0 #fff0;
          }
        }
        .animate-underline-glow {
          animation: underline-glow 2.5s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3.5s ease-in-out infinite;
        }
        @keyframes shooting-star {
          0% {
            transform: translateX(-100px) scaleX(0.7);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px) scaleX(1);
            opacity: 0;
          }
        }
        .animate-shooting-star {
          animation: shooting-star 2.8s linear infinite;
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
        @keyframes float-sparkle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        .animate-float-sparkle {
          animation: float-sparkle 2.5s ease-in-out infinite;
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(-8deg) scale(1);
          }
          50% {
            transform: rotate(8deg) scale(1.15);
          }
        }
        .animate-wiggle {
          animation: wiggle 1.8s ease-in-out infinite;
        }
        @keyframes wiggle-reverse {
          0%,
          100% {
            transform: rotate(8deg) scale(1);
          }
          50% {
            transform: rotate(-8deg) scale(1.15);
          }
        }
        .animate-wiggle-reverse {
          animation: wiggle-reverse 1.8s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
}
