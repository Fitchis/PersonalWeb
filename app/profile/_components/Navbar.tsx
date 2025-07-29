"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-gray-900 text-white shadow-md px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-wide">My Profile</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className={`pb-1 border-b-2 ${
                  pathname === "/"
                    ? "border-white text-white"
                    : "border-transparent text-gray-300 hover:text-white hover:border-white"
                } transition-all duration-200`}
              >
                Home
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
