"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./style.css";

interface Quiz {
  _id: string;
  title: string;
  difficulty: string;
}

const EditQuizPage: React.FC = () => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("http://localhost:3000/quizzes"); // Adjust API endpoint if needed
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes.");
        }
        const data = await response.json();
        setQuizzes(data);
      } catch (err) {
        setError("Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleUpdate = (quizId: string) => {
    router.push(`/dashboard/instructor/quiz/update-quiz/${quizId}`);
  };

  const handleDelete = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const response = await fetch(`http://localhost:3000/quizzes/${quizId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete quiz.");
      }

      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== quizId));
      alert("Quiz deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete quiz. Please try again.");
    }
  };

  if (loading) return <div className="quiz-container">Loading quizzes...</div>;
  if (error) return <div className="quiz-container">{error}</div>;

  return (
    <div className="quiz-container">
      <h1>Edit Quizzes</h1>
      <div className="quiz-list">
        {quizzes.length === 0 ? (
          <p>No quizzes available.</p>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              <h3>{quiz.title}</h3>
              <p>Difficulty: {quiz.difficulty}</p>
              <div className="quiz-card-buttons">
                <button
                  className="quiz-button update-quiz"
                  onClick={() => handleUpdate(quiz._id)}
                >
                  Update
                </button>
                <button
                  className="quiz-button delete-quiz"
                  onClick={() => handleDelete(quiz._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EditQuizPage;
