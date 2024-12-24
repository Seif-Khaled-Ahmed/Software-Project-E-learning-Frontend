"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import "./analytics.css";

// Register the necessary components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InstructorAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAnalytics = async () => {
      const session = localStorage.getItem("session");
      if (session) {
        const parsedSession = JSON.parse(session);
        const response = await fetch(`http://localhost:3000/progress/dashboard/instructor/analytics?course_id=${parsedSession.course_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${parsedSession.accessToken}`,
          },
        });
        const data = await response.json();
        setAnalytics({
          ...data,
          avgCompletionRate: isNaN(data.avgCompletionRate) ? 0 : data.avgCompletionRate,
          avgScore: isNaN(data.avgScore) ? 0 : data.avgScore,
          avgCourseRating: isNaN(data.avgCourseRating) ? 0 : data.avgCourseRating,
          avgInstructorRating: isNaN(data.avgInstructorRating) ? 0 : data.avgInstructorRating,
        });
      } else {
        router.push("/login");
      }
    };

    fetchAnalytics();
  }, [router]);

  const handleDownload = async () => {
    const session = localStorage.getItem("session");
    if (session) {
      const parsedSession = JSON.parse(session);
      const response = await fetch(`http://localhost:3000/progress/download-analytics?course_id=${parsedSession.course_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${parsedSession.accessToken}`,
        },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analytics.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  if (!analytics) {
    return <div>Loading...</div>;
  }

  const data = {
    labels: ['Below Average', 'Average', 'Above Average', 'Excellent'],
    datasets: [
      {
        label: 'Student Performance',
        data: [analytics.belowAverage, analytics.average, analytics.aboveAverage, analytics.excellent],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="instructor-analytics-page">
      <h1>Instructor Analytics</h1>
      <p>Total Students: {analytics.totalStudents}</p>
      <p>Average Completion Rate: {analytics.avgCompletionRate}%</p>
      <p>Average Score: {analytics.avgScore}</p>
      <p>Average Course Rating: {analytics.avgCourseRating}</p>
      <p>Average Instructor Rating: {analytics.avgInstructorRating}</p>
      <h2>Student Engagement</h2>
      <Bar data={data} />
      <button onClick={handleDownload}>Download Analytics</button>
    </div>
  );
};

export default InstructorAnalyticsPage;