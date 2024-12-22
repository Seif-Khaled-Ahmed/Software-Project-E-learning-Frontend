"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const StartQuiz: React.FC = () => {
  const [quiz, setQuiz] = useState<{
    title: string;
    difficulty: string;
    questions: { text: string; options: string[]; correctAnswer: string }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");

  useEffect(() => {
    const fetchQuiz = async () => {
      const session = localStorage.getItem("session");
      if (session) {
        const parsedSession = JSON.parse(session);
        try {
          const response = await fetch(`http://localhost:3000/quizzes/${quizId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${parsedSession.accessToken}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch quiz.");
          }
          const data = await response.json();
          setQuiz(data);
        } catch (err: any) {
          setError(err.message || "Something went wrong");
        }
      }
    };

    if (quizId) {
      fetchQuiz();
    } else {
      setError("Quiz ID is missing.");
    }
  }, [quizId]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!quiz) {
    return <p>Loading quiz...</p>;
  }

  return (
    <div>
      <h1>{quiz.title}</h1>
      <p>Difficulty: {quiz.difficulty}</p>
      {quiz.questions.map((question, index) => (
        <div key={index}>
          <h3>{question.text}</h3>
          {question.options.map((option, idx) => (
            <p key={idx}>{option}</p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default StartQuiz;
