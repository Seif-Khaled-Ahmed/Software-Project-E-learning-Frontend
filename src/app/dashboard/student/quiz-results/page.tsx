"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./quiz-results.css";

const QuizResultsPage: React.FC = () => {
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchQuizResults = async () => {
      const session = localStorage.getItem("session");
      if (session) {
        const parsedSession = JSON.parse(session);
        const response = await fetch(`http://localhost:3000/progress/quiz-results/${parsedSession.quiz_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${parsedSession.accessToken}`,
          },
        });
        const data = await response.json();
        setQuizResults(data);
      } else {
        router.push("/login");
      }
    };

    fetchQuizResults();
  }, [router]);

  if (quizResults.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quiz-results-page">
      <h1>Quiz Results</h1>
      <ul>
        {quizResults.map((result) => (
          <li key={result._id}>
            <p>User ID: {result.user_id}</p>
            <p>Score: {result.score}</p>
            <p>Submitted At: {new Date(result.submitted_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizResultsPage;