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
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/90 border-b border-gray-800/70 shadow-2xl backdrop-blur-xl"
            : "bg-black/60 border-b border-gray-800/30 backdrop-blur-lg"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* --- MOBILE FLEX LAYOUT --- */}
          <div className="flex items-center justify-between md:justify-between relative">
            {/* Mobile Menu Button (left) */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg border border-gray-700 bg-gray-900/80 hover:bg-gray-800/80 hover:text-white text-gray-400 transition-colors duration-200 shadow-sm"
                aria-label="Open menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Logo (center on mobile, left on desktop) */}
            <div className="flex-1 flex items-center justify-center md:justify-start gap-2 sm:gap-3 group cursor-pointer absolute left-1/2 top-1/2 md:static md:left-0 md:top-0 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg border border-blue-500/50 group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent select-none">
                Dashboard
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
            <div className="hidden md:flex items-center gap-8 ml-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionClick(item.id)}
                    className={`flex items-center gap-2 font-semibold px-3 py-1 rounded-lg transition-all duration-200 hover:scale-105 transform relative group shadow-sm border border-transparent hover:border-blue-400/40 ${
                      activeSection === item.id
                        ? "text-blue-400 bg-blue-500/10 border-blue-400/60 shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    <span
                      className={`absolute -bottom-2 left-0 h-0.5 bg-blue-400 transition-all duration-200 ${
                        activeSection === item.id
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </button>
                );
              })}

              <Link
                href="/profile"
                className="flex items-center gap-2 text-gray-400 hover:text-white font-semibold px-3 py-1 rounded-lg transition-all duration-200 hover:scale-105 transform relative group border border-transparent hover:border-purple-400/40 hover:bg-purple-900/20 shadow-sm"
              >
                <User className="h-4 w-4" />
                Profile
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-200 group-hover:w-full"></span>
              </Link>

              {/* Admin link, only show if user is admin */}
              {session?.user &&
                (session.user as { role?: string }).role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 text-blue-400 hover:text-white font-semibold px-3 py-1 rounded-lg transition-all duration-200 hover:scale-105 transform relative group border border-transparent hover:border-blue-400/40 hover:bg-blue-900/20 shadow-sm"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                  </Link>
                )}

              {/* Notifications (only show if logged in) */}
              <NotificationDropdown
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
              />
            </div>

            {/* Auth Button (desktop only) */}
            <div className="hidden sm:block ml-4">
              <AuthButton />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-4 bg-black/95 border-t border-gray-800/50 backdrop-blur-xl">
            <div className="space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionClick(item.id)}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeSection === item.id
                        ? "text-blue-400 bg-blue-500/10"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}

              <Link
                href="/profile"
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>

              {/* Admin link, only show if user is admin */}
              {session?.user &&
                (session.user as { role?: string }).role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-blue-400 hover:text-white hover:bg-gray-800/50 font-medium transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}

              <div className="pt-3 border-t border-gray-800/50">
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
