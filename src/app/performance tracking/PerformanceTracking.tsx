'use client';

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchProgressData } from './services/progressService';

const PerformanceTracking = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await fetchProgressData();
        setProgress(data);
      } catch (err) {
        setError('Failed to load progress data.');
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Prepare data for the chart
  const chartData = {
    labels: progress.map((item: any) => `Course ${item.course_id}`),
    datasets: [
      {
        label: 'Completion Percentage',
        data: progress.map((item: any) => item.completion_percentage),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Performance Tracking</h2>
      <Line data={chartData} />
    </div>
  );
};

export default PerformanceTracking;
