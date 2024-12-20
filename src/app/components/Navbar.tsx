"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "../style/Navbar.css";

const Navbar: React.FC = () => {
  const router = useRouter();

  return (
    <nav className="navbar">
      <ul>
        <li>
          <a href="/dashboard" onClick={() => router.push("/")}>
            Home
          </a>
        </li>
        <li>
          <a href="/courses" onClick={() => router.push("/courses")}>
            Courses
          </a>
        </li>
        <li>
          <a href="/profile" onClick={() => router.push("/profile")}>
            Profile
          </a>
        </li>
        <li>
          <a href="/settings" onClick={() => router.push("/settings")}>
            Settings
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
