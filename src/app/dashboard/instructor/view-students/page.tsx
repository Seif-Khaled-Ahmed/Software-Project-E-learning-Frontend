"use client";

import React, { useState } from "react";
import "../instructor.css";

interface Student {
  id: string;
  name: string;
  progress: string; // Add any additional fields your API returns
}

const InstructorDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a name to search.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/users/search/student?name=${searchQuery}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data: Student[] = await response.json();

      setStudents(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="instructor-dashboard">
      <h1>Instructor Dashboard</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search student by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="search-button">
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="students-list">
        {students.length > 0 ? (
          students.map((student, index) => (
            <div key={student.id || index} className="student-item">
              <p>
                <strong>Name:</strong> {student.name}
              </p>
              <p>
                <strong>Progress:</strong> {student.progress}
              </p>
            </div>
          ))
        ) : (
          <p className="no-results">No students found.</p>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
