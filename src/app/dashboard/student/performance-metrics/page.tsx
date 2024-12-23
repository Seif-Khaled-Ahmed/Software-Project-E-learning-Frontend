"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from "react-chartjs-2";
import "./performance-metrics.css";

// Register the required components
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const PerformanceMetrics: React.FC = () => {
  const [completionRates, setCompletionRates] = useState<number[]>([]);
  const [averageScores, setAverageScores] = useState<number[]>([]);
  const [engagementTrends, setEngagementTrends] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("http://localhost:3000/progress/student-dashboard-data?user_id");
        const data = await response.json();
        setCompletionRates(data.completionRates);
        setAverageScores(data.averageScores);
        setEngagementTrends(data.engagementTrends);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching metrics:", error);
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="performance-metrics-container">
      <h1>Performance Metrics</h1>
      <div className="chart-container">
        <h2>Course Completion Rates</h2>
        <Bar
          data={{
            labels: ["Course 1", "Course 2", "Course 3", "Course 4"],
            datasets: [
              {
                label: "Completion Rate",
                data: completionRates,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          }}
        />
      </div>
      <div className="chart-container">
        <h2>Average Scores</h2>
        <Line
          data={{
            labels: ["Course 1", "Course 2", "Course 3", "Course 4"],
            datasets: [
              {
                label: "Average Score",
                data: averageScores,
                backgroundColor: "rgba(153, 102, 255, 0.6)",
                borderColor: "rgba(153, 102, 255, 1)",
                fill: false,
              },
            ],
          }}
        />
      </div>
      <div className="chart-container">
        <h2>Engagement Trends</h2>
        <Line
          data={{
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [
              {
                label: "Engagement",
                data: engagementTrends,
                backgroundColor: "rgba(255, 159, 64, 0.6)",
                borderColor: "rgba(255, 159, 64, 1)",
                fill: false,
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default PerformanceMetrics;