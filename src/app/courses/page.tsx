"use-client";
import React , { useState , useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./CourseDashboard.module.css";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  createdBy: string;
  isDeleted?: boolean;
}

const CoursesDashboard: React.FC = () => {
    const [courses, setCourses] = useState<{
        title: string,
        description: string,
        category: string,
        difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
        createdBy: string,
        isDeleted?: boolean
    }[]
    >([]); //initialise as empty array

    const[title, setTitle] = useState("");
    const[description, setDesc] = useState("");
    const[category, setCategory] = useState("");
    const[difficulty, setDifficulty] = useState("");
    const[createdBy, setCreatedBy] = useState("");
    const[loading, setLoading] = useState(true);
    const[search, setSearch] = useState<string>("");
    const[studentId, setStudentId] = useState<string | null>(null);
    //const[progress, setProgress] = useState<Progress[]>([]);
    //const[file, setFile] = useState<File | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCourses = async() => {
            const response = await fetch("http://localhost:3000/courses", {
                method: "GET"
            });
            const data = await response.json();
            setCourses(data.filter((course: any) => !course.isDeleted));
            setTitle(data.title);
            setDesc(data.description);
            setCategory(data.category);
            setDifficulty(data.difficulty);
            setCreatedBy(data.createdBy);
        };
    })

    const handleDelete = async (courseId: string) => {
        try {
            const userResponse = await fetch(`http://localhost:3000/users/profile`, {
                method: "GET",
            });
            const userData = await userResponse.json();

            if (userData.role === "instructor" || userData.role === "admin") {
                const response = await fetch(`http://localhost:3000/courses/${courseId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ isDeleted: true }),
                });

                if (response.ok) {
                    setCourses((oldCourses) =>
                        oldCourses
                            .map((course) =>
                                courseId === courseId ? { ...course, isDeleted: true } : course
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

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/courses/search?title=${search}`,
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
      }
    } catch (error) {
      console.error("Error searching courses:", error);
    }
  };

  return (
    <div className="styles.courseDashboard">
      <h1>Course Dashboard</h1>

      <h2>All Courses</h2>
      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course.title}>
              <h3>{course.title}</h3>
              <p>
                <strong>Description:</strong> {course.description}
              </p>
              <p>
                <strong>Category:</strong> {course.category}
              </p>
              <p>
                <strong>Difficulty:</strong> {course.difficulty}
              </p>
              <p>
                <strong>Created By:</strong> {course.createdBy}
              </p>
              {!course.isDeleted && (
                <button onClick={() => handleDelete(course.title)}>
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available.</p>
      )}

      <section>
        <h2>Search Courses</h2>
        <input
          type="text"
          placeholder="Search by title, description, or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => handleSearch()}>Search</button>
      </section>
    </div>
  );
};

export default CoursesDashboard;