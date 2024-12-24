"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Question {
  _id: string;
  text: string;
  difficulty: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  questions: Question[];
}

const StartQuiz: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [grade, setGrade] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { moduleId } = useParams(); // Assuming moduleId is passed in the route
  const router = useRouter();

  // Fetch quiz questions for the module
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/modules/${moduleId}/start_quiz`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setQuiz(data);
        } else {
          console.error(`Failed to fetch quiz: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [moduleId]);

  // Handle answer selection
  const handleAnswerChange = (questionId: string, selectedOption: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  // Submit the quiz
  const handleSubmitQuiz = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/modules/${moduleId}/grade_quiz`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setGrade(data.grade); // Assuming the backend returns a grade
      } else {
        console.error(`Failed to submit quiz: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (loading) {
    return <div>Loading quiz...</div>;
  }

  if (!quiz) {
    return <div>No quiz available for this module.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Start Quiz</h1>

        {grade !== null ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600">Your Grade: {grade}%</h2>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => router.push(`/student/module/${moduleId}`)}
            >
              Go Back to Modules
            </button>
          </div>
        ) : (
          <div>
            <ul className="space-y-6">
              {quiz.questions.map((question, index) => (
                <li key={question._id} className="p-4 border border-gray-300 rounded-md">
                  <h3 className="text-lg font-semibold">
                    Question {index + 1}: {question.text}
                  </h3>
                  <div className="mt-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="block mt-2 text-gray-800"
                      >
                        <input
                          type="radio"
                          name={question._id}
                          value={option}
                          checked={answers[question._id] === option}
                          onChange={() =>
                            handleAnswerChange(question._id, option)
                          }
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <button
              className="mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={handleSubmitQuiz}
            >
              Submit Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartQuiz;
