"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Module {
  _id: string;
  title: string;
  content: string;
  resources: string[];
}

const StudentModules: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [courseId, setCourseId] = useState<string>("64ebc9b0e53ad88b7d0d9bf7"); // Replace with actual course ID
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Fetch modules for the given course
  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/courses/${courseId}/modules`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setModules(data);
        } else {
          console.error(`Failed to fetch modules: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId]);

  // Handle Start Quiz
  const handleStartQuiz = (moduleId: string) => {
    router.push(`/student/module/${moduleId}/start_quiz`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Course Modules</h1>

        {loading ? (
          <p>Loading modules...</p>
        ) : modules.length > 0 ? (
          <ul className="space-y-4">
            {modules.map((module) => (
              <li
                key={module._id}
                className="p-4 border border-gray-300 rounded-md"
              >
                <h3 className="text-lg font-semibold">{module.title}</h3>
                <p className="text-sm text-gray-600">{module.content}</p>

                {/* Display resources as clickable links */}
                <div className="mt-2">
                  <h4 className="font-semibold">Resources:</h4>
                  {module.resources.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {module.resources.map((resource, index) => (
                        <li key={index}>
                          <a
                            href={resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline hover:text-blue-700"
                          >
                            {resource}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No resources available</p>
                  )}
                </div>

                {/* Start Quiz Button */}
                <div className="mt-4">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={() => handleStartQuiz(module._id)}
                  >
                    Start Quiz
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No modules available for this course.</p>
        )}
      </div>
    </div>
  );
};

export default StudentModules;
