"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const StartQuiz: React.FC = () => {
  const [difficulty, setDifficulty] = useState("Easy");
  const [error, setError] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<
    { _id: string; title: string; difficulty: string }[]
  >([]);
  const router = useRouter();

  // Fetch quizzes based on selected difficulty
  const fetchQuizzes = async (difficulty: string) => {
    try {
      const response = await fetch(`http://localhost:3000/quizzes?difficulty=${difficulty}`);
      if (!response.ok) throw new Error("No quizzes found.");
      const data = await response.json();
      setQuizzes(data);
    } catch (err: any) {
      setError(err.message || "Failed to load quizzes.");
    }
  };

  const handleStartQuiz = (quizId: string) => {
    // Redirect to the specific quiz page
    router.push(`/Quiz/start/${quizId}`);
  };

  // Fetch quizzes when difficulty changes
  useEffect(() => {
    fetchQuizzes(difficulty);
  }, [difficulty]);

  return (
    <div className="quiz-container">
      <h1>Start a Quiz</h1>
      <label>Choose Difficulty:</label>
      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      {error && <p className="error">{error}</p>}
      <h2>Available Quizzes</h2>
      <ul>
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <li key={quiz._id}>
              <p>{quiz.title}</p>
              <p>
                <strong>Difficulty:</strong> {quiz.difficulty}
              </p>
              <button onClick={() => handleStartQuiz(quiz._id)}>Start Quiz</button>
            </li>
          ))
        ) : (
          <p>No quizzes available for the selected difficulty.</p>
        )}
      </ul>
    </div>
  );
};

export default StartQuiz;
