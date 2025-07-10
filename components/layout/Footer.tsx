"use client";
import React, { useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  Mail,
  ArrowUp,
  Shield,
  Zap,
  Clock,
  CigaretteIcon,
} from "lucide-react";
import Link from "next/link";

function Footer() {
  const [currentYear] = useState(new Date().getFullYear());
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [uptime] = useState("99.9%");

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com/Fitchis", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/andilthfi",
      label: "LinkedIn",
    },
    { icon: Mail, href: "mailto:andilthfi@gmail.com", label: "Email" },
  ];

  const quickStats = [
    {
      icon: Zap,
      label: "System Status",
      value: "Online",
      color: "text-green-400",
    },
    {
      icon: Shield,
      label: "Connection",
      value: "SSL Secured",
      color: "text-blue-400",
    },
    { icon: Clock, label: "Uptime", value: uptime, color: "text-purple-400" },
  ];

  return (
    <footer className="relative bottom-0 left-0 w-full z-40">
      {/* Gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>

      {/* Main footer content */}
      <div className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-t border-slate-700/30 w-full">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 sm:py-12">
            {/* Top section with brand and social links */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
              {/* Brand */}
              <div className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
                    <span className="font-bold text-white">T2W</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div>
                  <span className="text-slate-200 font-bold text-lg block">
                    Task2Work
                  </span>
                  <span className="text-slate-400 text-sm">
                    Productivity made simple
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/70 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:scale-110 border border-slate-700/30 hover:border-slate-600/50"
                    >
                      <Icon className="w-4 h-4" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700/20 hover:bg-slate-800/50 transition-all duration-200"
                  >
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-slate-300 text-sm font-medium">
                        {stat.label}
                      </div>
                      <div className={`text-xs font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom section */}
            <div className="pt-6 border-t border-slate-700/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Copyright */}
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span>&copy; {currentYear} Personal Dashboard.</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline flex items-center gap-1">
                    Built with{" "}
                    <CigaretteIcon className="w-3 h-3 text-red-400 animate-pulse" />{" "}
                    and React
                  </span>
                </div>

                {/* Version info */}
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <span className="px-2 py-1 bg-slate-700/50 rounded-full">
                    v2.1.0
                  </span>
                  <span>•</span>
                  <span>Last updated: Jan 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
}

export default Footer;
