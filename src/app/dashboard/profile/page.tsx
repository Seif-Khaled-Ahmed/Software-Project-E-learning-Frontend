"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [courseCategories, setCourseCategories] = useState<string[]>([]);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const fetchCourseCategories = async () => {
      const response = await fetch("http://localhost:3000/courses/categories", {
        method: "GET",
      });
      const categories = await response.json();
      setCourseCategories(categories);
    };

    fetchProfile();
    fetchCourseCategories();
  }, [router]);

  useEffect(() => {
    const uploadProfilePicture = async () => {
      if (profilePicture) {
        const session = localStorage.getItem("session");
        if (session) {
          const parsedSession = JSON.parse(session);
          if (parsedSession && parsedSession.accessToken) {
            const url = `http://localhost:3000/users/${parsedSession._id}/upload-profile-picture`;

            const formData = new FormData();
            formData.append("profilePicture", profilePicture);

            try {
              const response = await fetch(url, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${parsedSession.accessToken}`,
                },
                body: formData,
              });

              if (response.ok) {
                const data = await response.json();
                setProfile(data); // Update profile with new picture URL
                console.log("Profile picture uploaded successfully:", data);
              } else {
                console.error(
                  "Failed to upload profile picture",
                  response.statusText
                );
              }
            } catch (error) {
              console.error("Error during profile picture upload");
            }
          }
        }
      }
    };

    uploadProfilePicture();
  }, [profilePicture]);

  const handleUpdate = async () => {
    const session = localStorage.getItem("session");
    if (session) {
      const parsedSession = JSON.parse(session);
      if (parsedSession && parsedSession.accessToken) {
        const url = `http://localhost:3000/users/${parsedSession._id}/${
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
          const response = await fetch(`http://localhost:3000/users`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${parsedSession.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: parsedSession._id }),
          });

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

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfilePicture(e.target.files?.[0] || null);
  };

  const handleAddSubjectOfInterest = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCategory = event.target.value;
    if (!subjectsOfInterest.includes(selectedCategory)) {
      setSubjectsOfInterest([...subjectsOfInterest, selectedCategory]);
    }
  };

  const handleRemoveSubjectOfInterest = (category: string) => {
    setSubjectsOfInterest(
      subjectsOfInterest.filter((item) => item !== category)
    );
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
          src={
            `http://localhost:3000${profile?.profilePictureUrl}` ||
            "/images/profiledefault.jpg"
          }
          alt="Profile Picture"
          className="profile-picture"
          onClick={handleProfilePictureClick} // Add onClick event
          style={{ cursor: "pointer" }}
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleProfilePictureChange}
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
              <select
                value=""
                onChange={handleAddSubjectOfInterest}
                className="subjects-dropdown">
                <option value="" disabled>
                  Select a category
                </option>
                {courseCategories.map((category) => (
                  <option className="cat" key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ul className="subjects-list">
                {subjectsOfInterest.map((category, index) => (
                  <li key={index} className="subject-item">
                    {category}
                    <button
                      type="button"
                      onClick={() => handleRemoveSubjectOfInterest(category)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
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
        <button type="submit" className="update-button">
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
