"use client";

import React, { useEffect, useState } from "react";
import RecommendationComponent from "@/app/components/Recommendation";
import "../dashboard.css";

const StudentDashboard: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      const parsedSession = JSON.parse(session);
      if (parsedSession && parsedSession.accessToken) {
        setUserId(parsedSession.userId);
        setAccessToken(parsedSession.accessToken);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (!isAuthenticated) {
    return <div>Please log in to see your dashboard.</div>;
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-section"></div>
      {/* <div className="recommendation-section">
        {userId && accessToken && (
          <RecommendationComponent userId={userId} accessToken={accessToken} />
        )}
      </div> */}
    </div>
  );
};

export default StudentDashboard;
