"use client";

import React from "react";
import Navbar from "../components/Navbar"; // Adjust the import path accordingly
import Sidebar from "../components/Sidebar"; // Adjust the import path accordingly
import "./dashboard.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">{children}</div>
      </div>
      <style jsx>{`
        .dashboard-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .dashboard-content {
          display: flex;
          flex: 1;
        }
        .main-content {
          flex: 1;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
