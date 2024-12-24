"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Question {
  text: string;
  difficulty: string;
  options: string[]; // Fixed four options
  correctAnswer: string;
  explanation: string;
}

interface Module {
  _id: string;
  title: string;
  content: string;
  resources: string[];
  questionBank: Question[];
  createdAt: string;
}

const InstructorModules: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [courseId, setCourseId] = useState<string>("64ebc9b0e53ad88b7d0d9bf7"); // Replace with actual course ID
  const [newModule, setNewModule] = useState({
    title: "",
    content: "",
    resources: [""],
    questionBank: [
      {
        text: "",
        difficulty: "Easy",
        options: ["", "", "", ""], // Default four options
        correctAnswer: "",
        explanation: "",
      },
    ],
  });
  const [editModuleId, setEditModuleId] = useState<string | null>(null);
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

  // Create or update a module
  const handleSaveModule = async () => {
    if (!newModule.title || !newModule.content) {
      alert("Please provide a title and content for the module.");
      return;
    }

    const endpoint = editModuleId
      ? `http://localhost:3000/courses/${courseId}/modules/${editModuleId}`
      : `http://localhost:3000/courses/${courseId}/modules`;

    const method = editModuleId ? "PATCH" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newModule),
      });

      if (response.ok) {
        const savedModule = await response.json();
        if (editModuleId) {
          setModules((prevModules) =>
            prevModules.map((module) =>
              module._id === editModuleId ? savedModule : module
            )
          );
        } else {
          setModules((prevModules) => [...prevModules, savedModule]);
        }

        setNewModule({
          title: "",
          content: "",
          resources: [""],
          questionBank: [
            {
              text: "",
              difficulty: "Easy",
              options: ["", "", "", ""],
              correctAnswer: "",
              explanation: "",
            },
          ],
        });
        setEditModuleId(null);
      } else {
        console.error(`Failed to save module: ${response.status}`);
      }
    } catch (error) {
      console.error("Error saving module:", error);
    }
  };

  // Delete a module
  const handleDeleteModule = async (moduleId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/courses/${courseId}/modules/${moduleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setModules((prevModules) =>
          prevModules.filter((module) => module._id !== moduleId)
        );
      } else {
        console.error(`Failed to delete module: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  // Edit a module
  const handleEditModule = (module: Module) => {
    setEditModuleId(module._id);
    setNewModule({
      title: module.title,
      content: module.content,
      resources: module.resources,
      questionBank: module.questionBank,
    });
  };

  // Update resource or question
  const updateResource = (index: number, value: string) => {
    const updatedResources = [...newModule.resources];
    updatedResources[index] = value;
    setNewModule({ ...newModule, resources: updatedResources });
  };

  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | string[]
  ) => {
    const updatedQuestions = [...newModule.questionBank];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setNewModule({ ...newModule, questionBank: updatedQuestions });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6">Instructor Modules</h1>

        <h2 className="text-lg font-semibold mb-4">
          {editModuleId ? "Edit Module" : "Create Module"}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Module Title"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={newModule.title}
            onChange={(e) =>
              setNewModule({ ...newModule, title: e.target.value })
            }
          />
          <textarea
            placeholder="Module Content"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={newModule.content}
            onChange={(e) =>
              setNewModule({ ...newModule, content: e.target.value })
            }
          />

          <div>
            <h3 className="font-semibold">Resources</h3>
            {newModule.resources.map((resource, index) => (
              <input
                key={index}
                type="text"
                placeholder="Resource URL"
                className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                value={resource}
                onChange={(e) => updateResource(index, e.target.value)}
              />
            ))}
          </div>

          <div>
            <h3 className="font-semibold">Question Bank</h3>
            {newModule.questionBank.map((question, index) => (
              <div key={index} className="mb-4">
                <input
                  type="text"
                  placeholder="Question Text"
                  className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                  value={question.text}
                  onChange={(e) =>
                    updateQuestion(index, "text", e.target.value)
                  }
                />
                <select
                  className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                  value={question.difficulty}
                  onChange={(e) =>
                    updateQuestion(index, "difficulty", e.target.value)
                  }
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <h4 className="font-semibold">Options</h4>
                {question.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    placeholder={`Option ${optionIndex + 1}`}
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                    value={option}
                    onChange={(e) =>
                      updateQuestion(index, "options", [
                        ...question.options.slice(0, optionIndex),
                        e.target.value,
                        ...question.options.slice(optionIndex + 1),
                      ])
                    }
                  />
                ))}
                <input
                  type="text"
                  placeholder="Correct Answer"
                  className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                  value={question.correctAnswer}
                  onChange={(e) =>
                    updateQuestion(index, "correctAnswer", e.target.value)
                  }
                />
                <textarea
                  placeholder="Explanation"
                  className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                  value={question.explanation}
                  onChange={(e) =>
                    updateQuestion(index, "explanation", e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <button
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={handleSaveModule}
          >
            {editModuleId ? "Update Module" : "Create Module"}
          </button>
        </div>

        <h2 className="text-lg font-semibold mt-10 mb-4">Existing Modules</h2>
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
                <div className="flex gap-4 mt-4">
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() => handleDeleteModule(module._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={() => handleEditModule(module)}
                  >
                    Edit
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

export default InstructorModules;
