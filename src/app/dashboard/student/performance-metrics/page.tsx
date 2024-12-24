"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import "./performance-metrics.css";

// Register the necessary components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformanceMetricsPage: React.FC = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPerformanceMetrics = async () => {
      const session = localStorage.getItem("session");
      if (session) {
        const parsedSession = JSON.parse(session);
        const response = await fetch(`http://localhost:3000/progress/dashboard/student/performance-metrics?user_id=${parsedSession._id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${parsedSession.accessToken}`,
          },
        });
        const data = await response.json();
        setPerformanceMetrics({
          ...data,
          avgCompletionRate: isNaN(data.avgCompletionRate) ? 0 : data.avgCompletionRate,
          avgScore: isNaN(data.avgScore) ? 0 : data.avgScore,
        });

        const modulesResponse = await fetch(`http://localhost:3000/modules/student?user_id=${parsedSession._id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${parsedSession.accessToken}`,
          },
        });
        const modulesData = await modulesResponse.json();
        if (Array.isArray(modulesData)) {
          setModules(modulesData);
        } else {
          console.error("Modules data is not an array:", modulesData);
          setModules([]);
        }
      } else {
        router.push("/login");
      }
    };

    fetchPerformanceMetrics();
  }, [router]);

  if (!performanceMetrics) {
    return <div>Loading...</div>;
  }

  const data = {
    labels: ['Completion Rate', 'Average Score'],
    datasets: [
      {
        label: 'Performance Metrics',
        data: [performanceMetrics.avgCompletionRate, performanceMetrics.avgScore],
        backgroundColor: ['#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="performance-metrics-page">
      <h1>Performance Metrics</h1>
      <p>Total Courses: {performanceMetrics.totalCourses}</p>
      <p>Average Completion Rate: {performanceMetrics.avgCompletionRate}%</p>
      <p>Average Score: {performanceMetrics.avgScore}</p>
      <h2>Performance Overview</h2>
      <Bar data={data} />
      <h2>Recommended Modules</h2>
      <ul>
        {modules.map((module) => (
          <li key={module._id}>{module.title}</li>
        ))}
      </ul>
      <Link href="/dashboard/student/quiz-results">
        View Quiz Results
      </Link>
    </div>
  );
};

export default PerformanceMetricsPage;