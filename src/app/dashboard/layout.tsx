"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Adjust the import path accordingly
import Sidebar from "../components/Sidebar"; // Adjust the import path accordingly
import StudentDashboard from "./student/page"; // Ensure this path is correct
import InstructorDashboard from "./instructor/page"; // Ensure this path is correct
import AdminDashboard from "./admin/page"; // Ensure this path is correct
import "./dashboard.css";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      const parsedSession = JSON.parse(session);
      setRole(parsedSession.role); // Use the role from the session stored in localStorage
    }
  }, []);

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <Sidebar />

        {role === "student" && <StudentDashboard />}
        {role === "instructor" && <InstructorDashboard />}
        {role === "admin" && <AdminDashboard />}

        {children}
      </div>
    </div>
  );
}
