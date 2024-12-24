"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from "react-chartjs-2";
import "./analytics.css";

// Register the required components
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const InstructorAnalytics: React.FC = () => {
  const [engagementData, setEngagementData] = useState<number[]>([]);
  const [contentEffectiveness, setContentEffectiveness] = useState<number[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("http://localhost:3000/dashboard/instructor/analytics");
        const data = await response.json();
        setEngagementData(data.engagementTrends);
        setContentEffectiveness(data.contentEffectiveness);
        setAssessmentResults(data.assessmentResults);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setLoading(false);
      }
    };
  
    fetchAnalytics();
  }, []);
  
  const handleDownload = () => {
    const data = {
      engagementData,
      contentEffectiveness,
      assessmentResults,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <h1>Instructor Analytics</h1>
      <div className="chart-container">
        <h2>Student Engagement</h2>
        <Line
          data={{
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [
              {
                label: "Engagement",
                data: engagementData,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
              },
            ],
          }}
        />
      </div>
      <div className="chart-container">
        <h2>Content Effectiveness</h2>
        <Bar
          data={{
            labels: ["Content 1", "Content 2", "Content 3", "Content 4"],
            datasets: [
              {
                label: "Effectiveness",
                data: contentEffectiveness,
                backgroundColor: "rgba(153, 102, 255, 0.6)",
              },
            ],
          }}
        />
      </div>
      <div className="chart-container">
        <h2>Assessment Results</h2>
        <Line
          data={{
            labels: ["Assessment 1", "Assessment 2", "Assessment 3", "Assessment 4"],
            datasets: [
              {
                label: "Results",
                data: assessmentResults,
                backgroundColor: "rgba(255, 159, 64, 0.6)",
                borderColor: "rgba(255, 159, 64, 1)",
                fill: false,
              },
            ],
          }}
        />
      </div>
      <button className="download-button" onClick={handleDownload}>
        Download Analytics
      </button>
    </div>
  );
};

export default InstructorAnalytics;