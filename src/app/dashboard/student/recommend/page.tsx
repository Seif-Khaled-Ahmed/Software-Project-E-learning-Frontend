"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../../style/recommendation.css";

const RecommendationPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRecommendations = async () => {
      const session = localStorage.getItem("session");
      if (session) {
        const parsedSession = JSON.parse(session);

        if (!parsedSession._id) {
          console.error("User ID not found in session. Redirecting to login.");
          router.push("/login");
          return;
        }

        console.log("Fetching recommendations");

        // Introduce a delay of 10 seconds
        await new Promise((resolve) => setTimeout(resolve, 10000));

        try {
          const response = await fetch("http://localhost:3000/recommendation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: parsedSession._id }), // Ensure userId is sent
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          const data = await response.json();
          console.log("Fetched recommendations:", data.recommendedCourses);
          setRecommendations(data.recommendedCourses);
        } catch (error) {
          console.error("Failed to fetch recommendations");
        }
      } else {
        console.error("No session found. Redirecting to login.");
        router.push("/login");
      }
      setLoading(false);
    };

    fetchRecommendations();
  }, [router]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="recommendations-container">
      <h1>Recommended Courses</h1>
      <div className="recommendations-cards">
        {recommendations.map((courseTitle, index) => (
          <div key={index} className="recommendation-card">
            <h2>{courseTitle}</h2>
            <button
              onClick={() => {
                router.push(`/courses/${courseTitle}`);
              }}>
              View Course Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationPage;
