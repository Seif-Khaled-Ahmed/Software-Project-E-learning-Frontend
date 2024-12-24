"use client";

import React, { useState } from "react";
import "../instructor.css";

interface Student {
  id: string;
  name: string;
  progress: string; // Add any additional fields your API returns
  enrolledCourses?: Course[]; // Enrolled courses
  completedCourses?: Course[]; // Completed courses
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
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

      // Fetch enrolled and completed courses for each student
      const studentsWithCourses = await Promise.all(
        data.map(async (student) => {
          try {
            const enrolledCoursesResponse = await fetch(
              `http://localhost:3000/students/${student.id}/enrolledCourses`
            );
            const completedCoursesResponse = await fetch(
              `http://localhost:3000/students/${student.id}/completedCourses`
            );

            if (!enrolledCoursesResponse.ok || !completedCoursesResponse.ok) {
              throw new Error(`Failed to fetch courses for student: ${student.name}`);
            }

            const enrolledCourses: Course[] = await enrolledCoursesResponse.json();
            const completedCourses: Course[] = await completedCoursesResponse.json();

            return {
              ...student,
              enrolledCourses,
              completedCourses,
            };
          } catch (err) {
            console.error(`Error fetching courses for ${student.name}:`, err);
            return {
              ...student,
              enrolledCourses: [],
              completedCourses: [],
            }; // Default to empty if error occurs
          }
        })
      );

      setStudents(studentsWithCourses);
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
              <div className="enrolled-courses">
                <h3>Enrolled Courses:</h3>
                {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
                  <ul>
                    {student.enrolledCourses.map((course) => (
                      <li key={course.id}>
                        <p>
                          <strong>Title:</strong> {course.title}
                        </p>
                        <p>
                          <strong>Description:</strong> {course.description}
                        </p>
                        <p>
                          <strong>Category:</strong> {course.category}
                        </p>
                        <p>
                          <strong>Difficulty:</strong> {course.difficulty}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No enrolled courses found for this student.</p>
                )}
              </div>
              <div className="completed-courses">
                <h3>Completed Courses:</h3>
                {student.completedCourses && student.completedCourses.length > 0 ? (
                  <ul>
                    {student.completedCourses.map((course) => (
                      <li key={course.id}>
                        <p>
                          <strong>Title:</strong> {course.title}
                        </p>
                        <p>
                          <strong>Description:</strong> {course.description}
                        </p>
                        <p>
                          <strong>Category:</strong> {course.category}
                        </p>
                        <p>
                          <strong>Difficulty:</strong> {course.difficulty}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No completed courses found for this student.</p>
                )}
              </div>
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
