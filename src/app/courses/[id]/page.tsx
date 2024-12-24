"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import './CourseProfile.css';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  createdBy: string;
  isDeleted?: boolean;
}

const CoursesProfile: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [studentId, setStudentId] = useState<string | null>(null);
  const [updateCourseId, setUpdateCourseId] = useState("");
  const [deleteCourseId, setDeleteCourseId] = useState("");
  const [updateData, setUpdateData] = useState<Partial<Course>>({});

  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userResponse = await fetch(
          `http://localhost:3000/users/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const userData = await userResponse.json();

        if (
          userData.role === "student" ||
          (userData.role === "instructor" && studentId)
        ) {
          const response = await fetch(`http://localhost:3000/courses`, {
            method: "GET",
          });
          const data = await response.json();
          setCourses(data.filter((course: any) => !course.isDeleted));
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [studentId]);

  const handleEnrolledCourses = async () => {
    try {
      setLoading(true);
      const userResponse = await fetch(`http://localhost:3000/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const userData = await userResponse.json();
      let link = `http://localhost:3000/users/${userData._id}/courses`;

      if (userData.role === "instructor" && studentId) {
        link = `http://localhost:3000/instructor/students/${studentId}/enrolledCourses`;
      }

      const response = await fetch(link, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch enrolled courses");
        return;
      }

      const data: Course[] = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    try {
      const userResponse = await fetch(`http://localhost:3000/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const userData = await userResponse.json();

      if (userData.role === "instructor" || userData.role === "admin") {
        const response = await fetch(
          `http://localhost:3000/courses/${courseId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          setCourses((oldCourses) =>
            oldCourses
              .map((course) =>
                course._id === courseId
                  ? { ...course, isDeleted: true }
                  : course
              )
              .filter((course) => !course.isDeleted)
          );
          console.log("Course successfully removed");
        }
      }
    } catch (error) {
      console.error(`Failed to delete course: ${courseId}`, error);
    }
  };

  const handleUpdate = async (
    courseId: string,
    updatedCourse: Partial<Course>
  ) => {
    try {
      const userResponse = await fetch(`http://localhost:3000/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const userData = await userResponse.json();

      if (userData.role === "instructor") {
        const response = await fetch(
          `http://localhost:3000/courses/${courseId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(updatedCourse),
          }
        );

        const updatedData = await response.json();
        if (response.ok) {
          setCourses((oldCourses) =>
            oldCourses.map((course) =>
              course._id === courseId ? { ...course, ...updatedData } : course
            )
          );
          console.log("Course updated successfully");
        }
      }
    } catch (error) {
      console.error(`Failed to update course: ${courseId}`, error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/courses/search?title=${searchQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const filteredCourses = await response.json();
        setCourses(
          filteredCourses.filter((course: Course) => !course.isDeleted)
        );

        setCourses(filteredCourses);
    };

    return (
        <div className="CourseProfile">
            <h1>Course Management</h1>


  return (
    <div className="courseProfile">
      <h1>Course Management</h1>

      <section>
        <h2>Get Enrolled Courses</h2>
        <button onClick={handleEnrolledCourses}>Fetch Enrolled Courses</button>
      </section>


            <section>
                <h2>Update Course</h2>
                <input
                    type="text"
                    placeholder="Course ID"
                    value={updateCourseId}
                    onChange={(e) => setUpdateCourseId(e.target.value)}
                />
                <div>
                    <input
                        type="text"
                        placeholder="New Title"
                        value={updateData.title || ""}
                        onChange={(e) =>
                            setUpdateData({ ...updateData, title: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="New Description"
                        value={updateData.description || ""}
                        onChange={(e) =>
                            setUpdateData({ ...updateData, description: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="New Category"
                        value={updateData.category || ""}
                        onChange={(e) =>
                            setUpdateData({ ...updateData, category: e.target.value })
                        }
                    />
                    
                    <select
                        value={updateData.difficulty || ""}
                        onChange={(e) =>
                        setUpdateData({ ...updateData, difficulty: e.target.value as "Beginner" || "Intermediate" || "Advanced" })
                        }
>
                        <option value="" disabled>
                            Select Difficulty
                        </option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                    
                </div>
                <button onClick={() => handleUpdate(updateCourseId, updateData)}>
                    Update Course
                </button>
            </section>

      <section>
        <h2>Update Course</h2>
        <input
          type="text"
          placeholder="Course ID"
          value={updateCourseId}
          onChange={(e) => setUpdateCourseId(e.target.value)}
        />
        <div>
          <input
            type="text"
            placeholder="New Title"
            value={updateData.title || ""}
            onChange={(e) =>
              setUpdateData({ ...updateData, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="New Description"
            value={updateData.description || ""}
            onChange={(e) =>
              setUpdateData({ ...updateData, description: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="New Category"
            value={updateData.category || ""}
            onChange={(e) =>
              setUpdateData({ ...updateData, category: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="New Difficulty"
            value={updateData.difficulty || ""}
            onChange={(e) =>
              setUpdateData({ ...updateData, difficulty: "Beginner" })
            }
          />
        </div>
        <button onClick={() => handleUpdate(updateCourseId, updateData)}>
          Update Course
        </button>
      </section>

      <section>
        <h2>Delete Course</h2>
        <input
          type="text"
          placeholder="Course ID"
          value={deleteCourseId}
          onChange={(e) => setDeleteCourseId(e.target.value)}
        />
        <button onClick={() => handleDelete(deleteCourseId)}>
          Delete Course
        </button>
      </section>

      {loading && <p>Loading...</p>}
    </div>
  );
};

export default CoursesProfile;
