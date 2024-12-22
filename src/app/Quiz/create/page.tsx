"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CreateQuiz: React.FC = () => {
  const router = useRouter();
  const [quizTitle, setQuizTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [questions, setQuestions] = useState<
    {
      question_id: string;
      text: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }[]
  >([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentOptions, setCurrentOptions] = useState<string[]>(["", "", "", ""]);
  const [currentCorrectAnswer, setCurrentCorrectAnswer] = useState("");
  const [currentExplanation, setCurrentExplanation] = useState("");

  const handleAddQuestion = () => {
    if (
      currentQuestion &&
      currentOptions.every((opt) => opt) &&
      currentCorrectAnswer &&
      currentExplanation
    ) {
      setQuestions([
        ...questions,
        {
          question_id: `q${questions.length + 1}`,
          text: currentQuestion,
          options: currentOptions,
          correctAnswer: currentCorrectAnswer,
          explanation: currentExplanation,
        },
      ]);
      setCurrentQuestion("");
      setCurrentOptions(["", "", "", ""]);
      setCurrentCorrectAnswer("");
      setCurrentExplanation("");
    } else {
      alert("Please fill in all the fields to add a question.");
    }
  };

  const handleSubmitQuiz = async () => {
    const module_id = "your_module_id_here"; // Replace with actual module ID

    if (!quizTitle || !questions.length) {
      alert("Please provide a title and add at least one question.");
      return;
    }

    const quizData = {
      module_id,
      title: quizTitle,
      difficulty,
      questions,
    };

    try {
      const response = await fetch("http://localhost:3000/quizzes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error creating quiz: ${errorData.message}`);
        return;
      }

      alert("Quiz created successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to create quiz:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="quiz-container">
      <h1>Create a Quiz</h1>
      <div className="form-section">
        <label>Quiz Title:</label>
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Enter quiz title"
        />

        <label>Difficulty:</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div className="form-section">
        <h2>Add Question</h2>
        <label>Question Text:</label>
        <input
          type="text"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          placeholder="Enter the question"
        />

        <h3>Options:</h3>
        {currentOptions.map((opt, index) => (
          <div key={index} className="option-group">
            <label>Option {index + 1}:</label>
            <input
              type="text"
              value={opt}
              onChange={(e) => {
                const updatedOptions = [...currentOptions];
                updatedOptions[index] = e.target.value;
                setCurrentOptions(updatedOptions);
              }}
              placeholder={`Option ${index + 1}`}
            />
          </div>
        ))}

        <label>Correct Answer:</label>
        <input
          type="text"
          value={currentCorrectAnswer}
          onChange={(e) => setCurrentCorrectAnswer(e.target.value)}
          placeholder="Enter the correct answer"
        />

        <label>Explanation:</label>
        <input
          type="text"
          value={currentExplanation}
          onChange={(e) => setCurrentExplanation(e.target.value)}
          placeholder="Enter an explanation for the answer"
        />

        <button className="add-question-btn" onClick={handleAddQuestion}>
          Add Question
        </button>
      </div>

      <div className="questions-preview">
        <h2>Questions Added:</h2>
        <ul>
          {questions.map((q, index) => (
            <li key={index}>
              <p>
                <strong>{index + 1}. {q.text}</strong>
              </p>
              <ul>
                {q.options.map((opt, idx) => (
                  <li key={idx}>{opt}</li>
                ))}
              </ul>
              <p>
                <strong>Correct Answer:</strong> {q.correctAnswer}
              </p>
              <p>
                <strong>Explanation:</strong> {q.explanation}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <button className="create-quiz-btn" onClick={handleSubmitQuiz}>
        Create Quiz
      </button>
    </div>
  );
};

export default CreateQuiz;
