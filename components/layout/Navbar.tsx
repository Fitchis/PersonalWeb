"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  CheckSquare,
  Briefcase,
  User,
  Home,
  Shield,
} from "lucide-react";

import AuthButton from "../AuthButton";
import NotificationDropdown from "../NotificationDropdown";
import { useSession } from "next-auth/react";

interface NavbarProps {
  scrollToSection: (sectionId: string) => void;
}

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "todo", label: "Tasks", icon: CheckSquare },
    { id: "job", label: "Jobs", icon: Briefcase },
  ];

  return (
    <>
      {/* Navbar */}
      <nav
        className={`w-full fixed top-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? "bg-slate-900/95 border-b border-slate-700/50 shadow-2xl backdrop-blur-2xl backdrop-saturate-150"
            : "bg-slate-900/70 border-b border-slate-700/30 backdrop-blur-xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* --- MOBILE FLEX LAYOUT --- */}
          <div className="flex items-center justify-between md:justify-between relative">
            {/* Mobile Menu Button (left) */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl border border-slate-600/50 bg-slate-800/90 hover:bg-slate-700/90 hover:border-slate-500/70 text-slate-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                aria-label="Open menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Logo (center on mobile, left on desktop) */}
            <div className="flex-1 flex items-center justify-center md:justify-start gap-3 sm:gap-4 group cursor-pointer absolute left-1/2 top-1/2 md:static md:left-0 md:top-0 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl border border-blue-400/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 backdrop-blur-sm">
                  <span className="text-white font-bold text-sm tracking-wide">
                    T2W
                  </span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent select-none tracking-tight">
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
            <div className="hidden md:flex items-center gap-2 ml-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionClick(item.id)}
                    className={`flex items-center gap-2.5 font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 transform relative group shadow-sm border backdrop-blur-sm ${
                      activeSection === item.id
                        ? "text-blue-300 bg-blue-500/20 border-blue-400/60 shadow-lg shadow-blue-500/20"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50 border-slate-600/30 hover:border-slate-500/50 hover:shadow-lg"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    <span
                      className={`absolute -bottom-1 left-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 transform -translate-x-1/2 rounded-full ${
                        activeSection === item.id
                          ? "w-3/4"
                          : "w-0 group-hover:w-3/4"
                      }`}
                    ></span>
                  </button>
                );
              })}

              <Link
                href="/profile"
                className="flex items-center gap-2.5 text-slate-300 hover:text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 transform relative group border border-slate-600/30 hover:border-purple-400/50 hover:bg-purple-900/20 shadow-sm hover:shadow-lg backdrop-blur-sm"
              >
                <User className="h-4 w-4" />
                Profile
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2 rounded-full"></span>
              </Link>

              {/* Admin link, only show if user is admin */}
              {session?.user &&
                (session.user as { role?: string }).role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2.5 text-blue-300 hover:text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 transform relative group border border-blue-400/40 hover:border-blue-400/60 hover:bg-blue-900/25 shadow-sm hover:shadow-lg backdrop-blur-sm"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                    <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2 rounded-full"></span>
                  </Link>
                )}

              {/* Notifications (only show if logged in) */}
              <div className="ml-2">
                <NotificationDropdown
                  notificationCount={notificationCount}
                  setNotificationCount={setNotificationCount}
                />
              </div>
            </div>

            {/* Auth Button (desktop only) */}
            <div className="hidden sm:block ml-4">
              <AuthButton />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-6 bg-slate-900/98 border-t border-slate-700/50 backdrop-blur-2xl">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionClick(item.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm ${
                      activeSection === item.id
                        ? "text-blue-300 bg-blue-500/20 border border-blue-400/50 shadow-lg shadow-blue-500/20"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50 border border-transparent hover:border-slate-600/50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}

              <Link
                href="/profile"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/50 font-medium transition-all duration-300 border border-transparent hover:border-slate-600/50 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                Profile
              </Link>

              {/* Admin link, only show if user is admin */}
              {session?.user &&
                (session.user as { role?: string }).role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-blue-300 hover:text-white hover:bg-blue-900/25 font-medium transition-all duration-300 border border-blue-400/40 hover:border-blue-400/60 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield className="h-5 w-5" />
                    Admin
                  </Link>
                )}

              <div className="pt-4 border-t border-slate-700/50 mt-4">
                <AuthButton />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
};

export default Navbar;
