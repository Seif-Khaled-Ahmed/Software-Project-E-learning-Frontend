"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import './coursesDashboard.css'; // Scoped CSS for this component

const CoursesDashboard: React.FC = () => {
    const [courses, setCourses] = useState<{
        _id: string; // Updated to match MongoDB ObjectId field
        title: string;
        description: string;
        category: string;
        difficulty: "Beginner" | "Intermediate" | "Advanced";
        createdBy: string;
        createdAt: string;
        isDeleted?: boolean;
        isOutdated?: boolean;
    }[]>([]);

    const [updateCourseId, setUpdateCourseId] = useState("");
    const [updateData, setUpdateData] = useState<Partial<{
        title: string;
        description: string;
        category: string;
        difficulty: "Beginner" | "Intermediate" | "Advanced";
    }>>({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const router = useRouter();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("http://localhost:3000/courses", {
                    method: "GET",
                });
                const data = await response.json();
                setCourses(data.filter((course: any) => !course.isDeleted));
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleDeleteCourse = async (courseId: string) => {
        if (!courseId) {
            setMessage("Invalid course ID.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/courses/${courseId}`, {
                method: "DELETE", // Correct method for deletion
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setCourses((oldCourses) =>
                    oldCourses.filter((course) => course._id !== courseId)
                );
                setMessage("Course deleted successfully!");
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Failed to delete course.");
            }
        } catch (error) {
            console.error("Error deleting course:", error);
            setMessage("An error occurred while deleting the course.");
        }
    };

    const handleFlagOutdated = async (courseId: string) => {
        if (!courseId) {
            setMessage("Invalid course ID.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/courses/${courseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isOutdated: true }),
            });

            if (response.ok) {
                setCourses((oldCourses) =>
                    oldCourses.map((course) =>
                        course._id === courseId ? { ...course, isOutdated: true } : course
                    )
                );
                setMessage("Course flagged as outdated!");
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Failed to flag course as outdated.");
            }
        } catch (error) {
            console.error("Error flagging course as outdated:", error);
            setMessage("An error occurred while flagging the course as outdated.");
        }
    };

    const handleUpdateCourse = async () => {
        if (!updateCourseId) {
            setMessage("Invalid course ID.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/courses/${updateCourseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                const updatedCourse = await response.json();
                setCourses((oldCourses) =>
                    oldCourses.map((course) =>
                        course._id === updateCourseId ? { ...course, ...updatedCourse } : course
                    )
                );
                setMessage("Course updated successfully!");
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Failed to update course.");
            }
        } catch (error) {
            console.error("Error updating course:", error);
            setMessage("An error occurred while updating the course.");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdateData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="courses-dashboard">
            <h1>Course Dashboard</h1>

            <section className="courses-section">
                <h2>All Courses</h2>
                {loading ? (
                    <p>Loading courses...</p>
                ) : courses.length > 0 ? (
                    <ul className="courses-list">
                        {courses.map((course) => (
                            <li key={course._id} className="course-item">
                                <h3>{course.title}</h3>
                                <p><strong>Description:</strong> {course.description}</p>
                                <p><strong>Category:</strong> {course.category}</p>
                                <p><strong>Difficulty:</strong> {course.difficulty}</p>
                                <p><strong>Created By:</strong> {course.createdBy}</p>
                                <p><strong>Created At:</strong> {new Date(course.createdAt).toLocaleDateString()}</p>
                                <p><strong>Outdated:</strong> {course.isOutdated ? "Yes" : "No"}</p>
                                <div className="course-actions">
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteCourse(course._id)}
                                    >
                                        Delete Course
                                    </button>
                                    <button
                                        className="outdated-button"
                                        onClick={() => handleFlagOutdated(course._id)}
                                        disabled={course.isOutdated}
                                    >
                                        {course.isOutdated ? "Outdated" : "Flag as Outdated"}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No courses available.</p>
                )}
            </section>

            <section>
                <h2>Update Course Info</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateCourse();
                    }}
                >
                    <div>
                        <label>Course ID:</label>
                        <input
                            type="text"
                            name="courseId"
                            value={updateCourseId}
                            onChange={(e) => setUpdateCourseId(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>New Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={updateData.title || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>New Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={updateData.description || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>New Category:</label>
                        <input
                            type="text"
                            name="category"
                            value={updateData.category || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>New Difficulty:</label>
                        <select
                            name="difficulty"
                            value={updateData.difficulty || ""}
                            onChange={handleInputChange}
                        >
                            <option value="" disabled>
                                Select Difficulty
                            </option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                    <button type="submit">Update Course</button>
                </form>
                {message && <p className="course-message">{message}</p>}
            </section>
        </div>
    );
};

export default CoursesDashboard;
