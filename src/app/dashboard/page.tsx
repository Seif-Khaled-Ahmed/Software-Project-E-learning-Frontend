"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "./dashboard.css"; // Make sure you create and import the CSS file

const Dashboard: React.FC = () => {
  const router = useRouter();

  return (
    <div className="dashboard">
      <div className="main-content">
        <h1 className="dashboard-heading">
          Welcome to Your <span className="highlight">Personalized</span>{" "}
          Dashboard!
        </h1>
        <p className="dashboard-intro">
          Explore a world of knowledge and track your learning progress with our
          interactive tools and resources.
        </p>
        <div className="dashboard-features">
          <div
            className="card"
            onClick={() => router.push("/dashboard/profile")}>
            <h2 className="card-title">View Your Profile</h2>
            <p className="card-content">
              Access and update your profile information.
            </p>
          </div>
          <div className="card" onClick={() => router.push("/settings")}>
            <h2 className="card-title">Go to Settings</h2>
            <p className="card-content">
              Manage your account settings and preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
