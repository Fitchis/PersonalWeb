import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">My Application</h1>
      <nav className="mt-4">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-gray-300 hover:text-white">
              Home
            </Link>
          </li>
          <li>
            <Link href="/profile" className="text-gray-300 hover:text-white">
              Profile
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
