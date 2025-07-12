"use client";
import React, { useState, useEffect } from "react";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import Link from "next/link";

function Footer() {
  const [currentYear] = useState(new Date().getFullYear());
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <footer className="relative bottom-0 left-0 w-full z-40">
      <div className="h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent"></div>
      <div className="bg-zinc-950 border-t border-zinc-800/50 w-full">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800">
                  <span className="font-bold text-white text-base">T2W</span>
                </div>
                <span className="text-zinc-300 font-bold text-base">
                  Task2Work
                </span>
              </div>
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={idx}
                      href={social.href}
                      aria-label={social.label}
                      className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-md flex items-center justify-center text-zinc-400 hover:text-blue-400 hover:border-blue-500 transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-zinc-800 pt-4">
              <div className="flex items-center gap-2 text-zinc-500 text-xs">
                <span>&copy; {currentYear} Personal Dashboard.</span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline">Built with React</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600 text-xs">
                <span className="px-2 py-0.5 bg-zinc-800 rounded-full">
                  v2.1.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-10 h-10 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-full flex items-center justify-center hover:text-blue-400 hover:border-blue-500 transition-all duration-200 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </footer>
  );
}

export default Footer;
