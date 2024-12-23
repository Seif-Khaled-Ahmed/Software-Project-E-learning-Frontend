"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../style/recommendation.css";

interface RecommendationComponentProps {
  userId: string;
  accessToken: string;
}

const RecommendationComponent: React.FC<RecommendationComponentProps> = ({
  userId,
  accessToken,
}) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRecommendations = async () => {
      const userData = {
        userId,
        courses: [], // Add logic to get user's current courses if needed
      };

      console.log("Fetching recommendations with data:", userData);

      const response = await fetch(
        `http://localhost:3000/recommendation/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched recommendations:", data.recommendedCourses);
        setRecommendations(data.recommendedCourses);
      } else {
        console.error("Failed to fetch recommendations", response.statusText);
      }
      setLoading(false);
    };

    if (userId && accessToken) {
      fetchRecommendations();
    } else {
      router.push("/login");
    }
  }, [userId, accessToken, router]);

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

export default RecommendationComponent;
