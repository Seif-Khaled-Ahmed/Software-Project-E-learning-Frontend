"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./profile.css";

const UnifiedProfile: React.FC = () => {
  const [profile, setProfile] = useState<{
    email: string;
    name: string;
    role: string;
    profilePictureUrl?: string;
    learningPreferences?: string;
    subjectsOfInterest?: string[];
    expertise?: string;
    teachingInterests?: string[];
  } | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [learningPreferences, setLearningPreferences] = useState("");
  const [subjectsOfInterest, setSubjectsOfInterest] = useState<string[]>([]);
  const [expertise, setExpertise] = useState("");
  const [teachingInterests, setTeachingInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
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
          setEmail(data.email);
          setName(data.name);
          if (data.role === "student") {
            setLearningPreferences(data.learningPreferences);
            setSubjectsOfInterest(data.subjectsOfInterest);
          } else if (data.role === "instructor") {
            setExpertise(data.expertise);
            setTeachingInterests(data.teachingInterests);
          }
          setLoading(false);
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    };

    fetchProfile();
  }, [router]);

  const handleUpdate = async () => {
    const session = localStorage.getItem("session");
    if (session) {
      const parsedSession = JSON.parse(session);
      if (parsedSession && parsedSession.accessToken) {
        const url = `http://localhost:3000/users/${parsedSession.userId}/${
          profile?.role === "student" ? "student-profile" : "instructor-profile"
        }`;
        const body =
          profile?.role === "student"
            ? {
                email,
                name,
                learningPreferences,
                subjectsOfInterest,
                profilePictureUrl: profile?.profilePictureUrl,
              }
            : {
                email,
                name,
                expertise,
                teachingInterests,
                profilePictureUrl: profile?.profilePictureUrl,
              };

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedSession.accessToken}`,
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          console.error("Failed to update profile");
        }
      }
    }
  };

  const handleDeleteAccount = async () => {
    const session = localStorage.getItem("session");
    if (session) {
      const parsedSession = JSON.parse(session);
      if (parsedSession && parsedSession.accessToken) {
        if (
          window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
          )
        ) {
          const response = await fetch(
            `http://localhost:3000/users/${parsedSession.userId}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            localStorage.removeItem("session");
            router.push("/login");
          } else {
            console.error("Failed to delete account");
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div
        className="loading"
        style={{
          fontSize: "24px",
          color: "blue",
          padding: "20px",
          textAlign: "center",
        }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={profile?.profilePictureUrl || "/images/profiledefault.jpg"}
          alt="Profile Picture"
          className="profile-picture"
        />
        <h1 className="profile-title">{profile?.name}</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {profile?.role === "student" && (
          <>
            <div className="input-group">
              <label>Learning Preferences:</label>
              <input
                type="text"
                value={learningPreferences}
                onChange={(e) => setLearningPreferences(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Subjects of Interest:</label>
              <input
                type="text"
                value={subjectsOfInterest.join(", ")}
                onChange={(e) =>
                  setSubjectsOfInterest(e.target.value.split(", "))
                }
              />
            </div>
          </>
        )}
        {profile?.role === "instructor" && (
          <>
            <div className="input-group">
              <label>Expertise:</label>
              <input
                type="text"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Teaching Interests:</label>
              <input
                type="text"
                value={teachingInterests.join(", ")}
                onChange={(e) =>
                  setTeachingInterests(e.target.value.split(", "))
                }
              />
            </div>
          </>
        )}
        <button type="button" className="update-button" onClick={handleUpdate}>
          Update Profile
        </button>
      </form>
      <button
        type="button"
        className="delete-button"
        onClick={handleDeleteAccount}>
        Delete Account
      </button>
    </div>
  );
};

export default UnifiedProfile;
