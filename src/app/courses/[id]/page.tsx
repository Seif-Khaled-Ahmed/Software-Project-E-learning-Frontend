"use-client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import './CourseProfile.css';

const CoursesProfile: React.FC = () => {
    const [courses, setCourses] = useState<{
        title: string;
        description: string;
        category: string;
        difficulty: "Beginner" | "Intermediate" | "Advanced";
        createdBy: string;
        isDeleted?: boolean;
    }[]>([]);

    const [title, setTitle] = useState("");
    const [description, setDesc] = useState("");
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [studentId, setStudentId] = useState<string | null>(null);
    const [updateCourseId, setUpdateCourseId] = useState("");
    const [deleteCourseId, setDeleteCourseId] = useState("");
    const [updateData, setUpdateData] = useState<Partial<{
        title: string;
        description: string;
        category: string;
        difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    }>>({});

    const router = useRouter();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const userResponse = await fetch(`http://localhost:3000/users/profile`, {
                    method: "GET",
                });
                const userData = await userResponse.json();

                if (userData.role === "student" || (userData.role === "instructor" && studentId)) {
                    const response = await fetch(`http://localhost:3000/courses`, {
                        method: "GET",
                    });
                    const data = await response.json();
                    setCourses(data.filter((course: any) => !course.isDeleted));

                    if (data.length > 0) {
                        const chosenCourse = data[0];
                        setTitle(chosenCourse.title);
                        setDesc(chosenCourse.description);
                        setCategory(chosenCourse.category);
                        setDifficulty(chosenCourse.difficulty);
                        setCreatedBy(chosenCourse.createdBy);
                    }
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchCourses();
    }, [studentId]);

    const handleEnrolledCourses = async () => {
        try {
            setLoading(true);
            const userResponse = await fetch(`http://localhost:3000/users/profile`, {
                method: "GET",
            });
            const userData = await userResponse.json();
            let link = `http://localhost:3000/users/enrolledCourses`;

            if (userData.role === "instructor" && studentId) {
                link = `http://localhost:3000/instructor/students/${studentId}/enrolledCourses`;
            }

            const response = await fetch(link, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.error("Failed to fetch enrolled courses");
                return;
            }

            const data: typeof courses = await response.json();
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

    const handleUpdate = async (
        courseId: string,
        updatedCourse: Partial<{
            title: string;
            description: string;
            category: string;
            difficulty: "Beginner" | "Intermediate" | "Advanced";
        }>
    ) => {
        try {
            const userResponse = await fetch(`http://localhost:3000/users/profile`, {
                method: "GET",
            });
            const userData = await userResponse.json();

            if (userData.role === "instructor") {
                const response = await fetch(`http://localhost:3000/courses/${courseId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedCourse),
                });

                const updatedData = await response.json();
                if (response.ok) {
                    setCourses((oldCourses) =>
                        oldCourses.map((course) =>
                            courseId === courseId ? { ...course, ...updatedData } : course
                        )
                    );
                    console.log("Course updated successfully");
                }
            }
        } catch (error) {
            console.error(`Failed to update course: ${courseId}`, error);
        }
    };

    const handleSearch = () => {
        const filteredCourses = courses.filter(
            (course) =>
                !course.isDeleted &&
                (course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    course.createdBy.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setCourses(filteredCourses);
    };

    return (
        <div className="CourseProfile">
            <h1>Course Management</h1>

            <section>
                <h2>Get Enrolled Courses</h2>
                <button onClick={handleEnrolledCourses}>Fetch Enrolled Courses</button>
            </section>

            <section>
                <h2>Search Courses</h2>
                <input
                    type="text"
                    placeholder="Search by title, description, or category"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
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
        </div>
    );
};

export default CoursesProfile;
