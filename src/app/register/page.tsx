"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./register.css";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "student" | "instructor";
}

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RegisterData["role"]>("student");
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (response.ok) {
        console.log("Registration successful");
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.push("/login");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message || "An error occurred");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="register-container flex">
        <div className="register-form flex-grow max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
          {showSuccess && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline"> Registration successful!</span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-gray-700 font-bold mb-2">
                Role
              </label>
              <select
                id="role"
                className="form-input"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as RegisterData["role"])
                }>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" className="submit-button">
                Register
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </form>
          <div className="text-center mt-4">
            <button
              className="login-button"
              onClick={() => router.push("/login")}>
              Already have an account? Login here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
