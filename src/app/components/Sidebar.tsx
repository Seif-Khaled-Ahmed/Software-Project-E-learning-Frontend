"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../style/Sidebar.css";

const Sidebar: React.FC = () => {
  const [profile, setProfile] = useState<{
    email: string;
    name: string;
    role: string;
    profilePictureUrl?: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      const parsedSession = JSON.parse(session);
      setProfile(parsedSession);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("session");
    router.push("/");
  };

  const renderLinks = () => {
    if (profile?.role === "student") {
      return (
        <>
          <li>
            <a
              href="/dashboard/profile"
              onClick={() => router.push("/dashboard/profile")}>
              Profile
            </a>
          </li>
          <li>
            <a
              href="/dashboard/student/courses"
              onClick={() => router.push("/dashboard/student/courses")}>
              Courses
            </a>
          </li>
          <li>
            <a
              href="/dashboard/student/enrolled-courses"
              onClick={() =>
                router.push("dashboard/student/enrolled-courses")
              }>
              Enrolled Courses
            </a>
          </li>
          <li>
            <a
              href="/dashboard/student/completed-courses"
              onClick={() =>
                router.push("/dashboard/student/completed-courses")
              }>
              Completed Courses
            </a>
          </li>
          <li>
            <a
              href="/dashboard/student/performance-metrics"
              onClick={() =>
                router.push("/dashboard/student/performance-metrics")
              }>
              Performance Metrics
            </a>
          </li>
          <li>
            <a
              href="/dashboard/student/search-instructors"
              onClick={() =>
                router.push("dashboard/student/search-instructors")
              }>
              Search Instructors
            </a>
          </li>
        </>
      );
    }

    if (profile?.role === "instructor") {
      return (
        <>
          <li>
            <a
              href="/dashboard/instructor/view-students"
              onClick={() =>
                router.push("/dashboard/instructor/view-students")
              }>
              View-Studnets
            </a>
          </li>
          <li>
            <a
              href="/dashboard/profile"
              onClick={() => router.push("/dashboard/profile")}>
              Profile
            </a>
          </li>
          <li>
            <a
              href="/dashboard/instructor/quiz"
              onClick={() => router.push("/dashboard/profile")}>
              quiz
            </a>
          </li>
          <li>
            <a
              href="/dashboard/instructor/courses"
              onClick={() => router.push("/dashboard/instructor/courses")}>
              Courses
            </a>
          </li>
          <li>
            <a
              href="/dashboard/instructor/track-progress"
              onClick={() =>
                router.push("/dashboard/instructor/track-progress")
              }>
              Track Progress
            </a>
          </li>
          <li>
            <a
              href="/dashboard/instructor/analytics"
              onClick={() => router.push("/dashboard/instructor/analytics")}>
              Analytics
            </a>
          </li>
          <li>
            <a
              href="/dashboard/instructor/manage-courses"
              onClick={() =>
                router.push("/dashboard/instructor/manage-courses")
              }>
              Manage Courses
            </a>
          </li>
        </>
      );
    }

    if (profile?.role === "admin") {
      return (
        <>
          <li>
            <a
              href="/dashboard/admin/courses"
              onClick={() => router.push("/dashboard/admin/courses")}>
              Courses
            </a>
          </li>
          <li>
            <a
              href="/dashboard/admin/manage-users"
              onClick={() => router.push("/dashboard/admin/manage-users")}>
              Manage Users
            </a>
          </li>

          <li>
            <a
              href="/dashboard/admin/data-backup"
              onClick={() => router.push("/dashboard/admin/data-backup")}>
              Data Backup
            </a>
          </li>
        </>
      );
    }

    return null;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const session = localStorage.getItem("session");
      if (session) {
        const parsedSession = JSON.parse(session);
        if (parsedSession && parsedSession.accessToken) {
          const response = await fetch("http://localhost:3000/users/profile", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${parsedSession.accessToken}`,
            },
          });
          const data = await response.json();
          setProfile(data);
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    };

    fetchProfile();
  }, [router]);

  const handleProfilePictureClick = () => {
    router.push("/dashboard/profile");
  };

  return (
    <aside className="sidebar">
      <div className="notification"></div>
      {profile && (
        <div className="profile-section">
          <img
            src={
              `http://localhost:3000${profile?.profilePictureUrl}` ||
              "/images/profiledefault.jpg"
            }
            alt="Profile Picture"
            className="profile-picture"
            onClick={handleProfilePictureClick} // Add onClick event
            style={{ cursor: "pointer" }}
          />
          <h2>{profile.name}</h2>
          <p>{profile.role}</p>
        </div>
      )}
      <nav>
        <ul>
          {renderLinks()}
          <li>
            <a
              href="/forums"
              onClick={(e) => {
                e.preventDefault(); // Prevent page reload
                router.push("/forums"); // Navigate to the forums page
              }}>
              Forums
            </a>
          </li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
