"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../style/Sidebar.css"; // Import the CSS file for styling

const Sidebar: React.FC = () => {
  const [profile, setProfile] = useState<{
    email: string;
    name: string;
    role: string;
    profilePictureUrl?: string;
  } | null>(null);
  const router = useRouter();

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

  return (
    <aside className="sidebar">
      {profile && (
        <div className="profile-section">
          <img
            src={profile.profilePictureUrl || "/images/profiledefault.jpg"}
            alt="Profile Picture"
            className="profile-picture"
          />
          <h2>{profile.name}</h2>
          <p>{profile.role}</p>
        </div>
      )}
      <nav>
        <ul>
          <li>
            <a href="/dashboard" onClick={() => router.push("/dashboard")}>
              Dashboard
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
            <a href="/courses" onClick={() => router.push("/courses")}>
              Courses
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
