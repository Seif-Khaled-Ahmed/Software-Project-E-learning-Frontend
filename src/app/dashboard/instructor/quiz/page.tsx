"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "./style.css";

const QuizPage: React.FC = () => {
  const router = useRouter();

  const navigateToCreateQuiz = () => {
    router.push("/dashboard/instructor/quiz/create-quiz");
  };

  const navigateToEditQuiz = () => {
    router.push("/dashboard/instructor/quiz/edit-quiz");
  };

  return (
    <div className="quiz-page-container">
      <h1 className="quiz-page-title">Quiz Management</h1>
      <p className="quiz-page-description">
        Manage your quizzes effortlessly. Create a new quiz or edit an existing one.
      </p>

      <div className="quiz-buttons">
        <button className="quiz-button create-quiz" onClick={navigateToCreateQuiz}>
          Create Quiz
        </button>
        <button className="quiz-button edit-quiz" onClick={navigateToEditQuiz}>
          Edit Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
