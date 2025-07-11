"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, CheckSquare, Briefcase, Home, Shield } from "lucide-react";
import AuthButton from "../AuthButton";
import NotificationDropdown from "../NotificationDropdown";
import { useSession } from "next-auth/react";

interface NavbarProps {
  scrollToSection: (sectionId: string) => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "todo", label: "Tasks", icon: CheckSquare },
  { id: "job", label: "Jobs", icon: Briefcase },
];

const Navbar: React.FC<NavbarProps> = ({ scrollToSection }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;
        const data = await res.json();
        setNotificationCount(data.count);
      } catch {}
    };
    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Section click handler
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className={`w-full fixed top-0 z-50 transition-all duration-700 ease-out ${
          isScrolled
            ? "bg-gradient-to-r from-slate-900/70 via-slate-800/60 to-slate-900/70 border-b border-slate-600/40 shadow-2xl shadow-slate-900/20 backdrop-blur-3xl backdrop-saturate-150"
            : "bg-gradient-to-r from-slate-900/40 via-slate-800/30 to-slate-900/40 border-b border-slate-600/20 backdrop-blur-2xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          {/* --- MOBILE FLEX LAYOUT --- */}
          <div className="flex items-center justify-between md:justify-between relative">
            {/* Mobile Menu Button (left) */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="group relative p-3 rounded-2xl border border-slate-600/40 bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 hover:from-slate-700/90 hover:via-slate-600/90 hover:to-slate-700/90 hover:border-slate-500/60 text-slate-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-slate-500/20 backdrop-blur-sm overflow-hidden"
                aria-label="Open menu"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative z-10">
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </div>
              </button>
            </div>

            {/* Logo (center on mobile, left on desktop) */}
            <div className="flex-1 flex items-center justify-center md:justify-start gap-4 sm:gap-5 group cursor-pointer absolute left-1/2 top-1/2 md:static md:left-0 md:top-0 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-cyan-400/30 via-blue-500/30 to-purple-600/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"></div>
              </div>
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent select-none tracking-tight">
                Task2Work
              </span>
            </div>

            {/* Mobile Notification Icon (right) */}
            <div className="flex md:hidden items-center ml-auto">
              <NotificationDropdown
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3 ml-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionClick(item.id)}
                    className={`group relative flex items-center gap-3 font-semibold px-5 py-3 rounded-2xl transition-all duration-300 hover:scale-105 transform shadow-sm border backdrop-blur-sm overflow-hidden ${
                      activeSection === item.id
                        ? "text-cyan-300 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-cyan-400/60 shadow-lg shadow-cyan-500/20"
                        : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-700/50 hover:via-slate-600/50 hover:to-slate-700/50 border-slate-600/30 hover:border-slate-500/50 hover:shadow-lg hover:shadow-slate-500/20"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Icon className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                    <span
                      className={`absolute -bottom-1 left-1/2 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 transition-all duration-300 transform -translate-x-1/2 rounded-full ${
                        activeSection === item.id
                          ? "w-3/4"
                          : "w-0 group-hover:w-3/4"
                      }`}
                    ></span>
                  </button>
                );
              })}

              {/* Admin link, only show if user is admin */}
              {session?.user &&
                (session.user as { role?: string }).role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="group relative flex items-center gap-3 text-orange-300 hover:text-white font-semibold px-5 py-3 rounded-2xl transition-all duration-300 hover:scale-105 transform border border-orange-400/40 hover:border-orange-400/60 hover:bg-gradient-to-r hover:from-orange-900/20 hover:via-red-900/20 hover:to-orange-900/20 shadow-sm hover:shadow-lg hover:shadow-orange-500/20 backdrop-blur-sm overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Shield className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">Admin</span>
                    <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-400 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2 rounded-full"></span>
                  </Link>
                )}

              {/* Notifications (only show if logged in) */}
              <div className="ml-3">
                <NotificationDropdown
                  notificationCount={notificationCount}
                  setNotificationCount={setNotificationCount}
                />
              </div>
            </div>

            {/* Auth Button (desktop only) */}
            <div className="hidden sm:block ml-6">
              <AuthButton />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-700 overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-6 bg-gradient-to-r from-slate-900/98 via-slate-800/98 to-slate-900/98 border-t border-slate-600/40 backdrop-blur-3xl">
            <div className="space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionClick(item.id)}
                    className={`group relative flex items-center gap-4 w-full px-5 py-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm overflow-hidden ${
                      activeSection === item.id
                        ? "text-cyan-300 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-400/50 shadow-lg shadow-cyan-500/20"
                        : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-700/50 hover:via-slate-600/50 hover:to-slate-700/50 border border-transparent hover:border-slate-600/50"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Icon className="h-5 w-5 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                  </button>
                );
              })}

              {/* Admin link, only show if user is admin */}
              {session?.user &&
                (session.user as { role?: string }).role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="group relative flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-orange-300 hover:text-white hover:bg-gradient-to-r hover:from-orange-900/20 hover:via-red-900/20 hover:to-orange-900/20 font-medium transition-all duration-300 border border-orange-400/40 hover:border-orange-400/60 backdrop-blur-sm overflow-hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Shield className="h-5 w-5 relative z-10" />
                    <span className="relative z-10">Admin</span>
                  </Link>
                )}

              <div className="pt-6 border-t border-slate-600/40 mt-6">
                <AuthButton />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-20 sm:h-24"></div>
    </>
  );
};

export default Navbar;
