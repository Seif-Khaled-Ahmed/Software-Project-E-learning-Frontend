"use client";

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import "../style/search.css";

interface User {
  id: string;
  name: string;
  role: "student" | "instructor";
  progress?: string; // For students
  department?: string; // For instructors
  coursesTaught?: string[]; // For instructors
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  createdBy: string;
}

const SearchComponent: React.FC<{ userType: "student" | "instructor" }> = ({
  userType,
}) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<(User | Course)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a query to search.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const [coursesResponse, studentsResponse, instructorsResponse] =
        await Promise.all([
          fetch(`http://localhost:3000/courses/search?name=${query}`),
          fetch(`http://localhost:3000/users/search/student?name=${query}`),
          fetch(`http://localhost:3000/users/search/instructor?name=${query}`),
        ]);

      if (
        !coursesResponse.ok ||
        !studentsResponse.ok ||
        !instructorsResponse.ok
      ) {
        throw new Error("Failed to fetch results");
      }

      const [courses, students, instructors] = await Promise.all([
        coursesResponse.json(),
        studentsResponse.json(),
        instructorsResponse.json(),
      ]);

      console.log("Courses:", courses);
      console.log("Students:", students);
      console.log("Instructors:", instructors);

      setResults([...courses, ...students, ...instructors]);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleEsc = (e: { key: string }) => {
    if (e.key === "Escape") {
      setQuery("");
      setResults([]);
    }
  };

  return (
    <div className="search-component">
      <div className="search-bar">
        <FaSearch id="search-icon" />
        <input
          placeholder="Search for courses, students, or instructors"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleEsc}
        />
      </div>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      <div className="search-results">
        {results.map((result) =>
          "title" in result ? (
            <div
              key={result.id || `${result.title}-${result.createdBy}`}
              className="course-result">
              <h3>{result.title}</h3>
              <p>Description: {result.description}</p>
              <p>Category: {result.category}</p>
              <p>Difficulty: {result.difficulty}</p>
              <p>Instructor ID: {result.createdBy}</p>
            </div>
          ) : (
            <div
              key={result.id || `${result.name}-${result.role}`}
              className="user-result">
              <h3 className="user-name">{result.name}</h3>
              <p>Role: {result.role}</p>
              {result.role === "student" && <p>Progress: {result.progress}</p>}
              {result.role === "instructor" && (
                <>
                  <p>Department: {result.department}</p>
                  <p>
                    Courses Taught:{" "}
                    {result.coursesTaught?.map((course, index) => (
                      <span key={`${result.id}-${course}-${index}`}>
                        {course}
                      </span>
                    ))}
                  </p>
                </>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
