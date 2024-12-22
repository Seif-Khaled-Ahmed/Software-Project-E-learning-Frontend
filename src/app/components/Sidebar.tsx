"use client";

import React, { Component } from "react";
import { useRouter } from "next/navigation";
import "../style/Sidebar.css";

// Define the shape of the profile state
interface Profile {
  email: string;
  name: string;
  role: string;
  profilePictureUrl?: string;
}

// Define an interface for the props if you want to type-check them
interface SidebarProps {
  router: ReturnType<typeof useRouter>; // Adjust this type based on actual return type of useRouter
}

// Define an interface for the state in the component
interface SidebarState {
  profile: Profile | null;
}

// Define an interface for the props if you want to type-check them
interface SidebarProps {
  router: ReturnType<typeof useRouter>; // Adjust this type based on actual return type of useRouter
}

// Base Sidebar class with common functionality
class SidebarBase extends Component<SidebarProps, SidebarState> {
  constructor(props: SidebarProps) {
    super(props);
    this.state = {
      profile: null
    };
  }

  componentDidMount() {
    this.fetchProfile();
  }

  fetchProfile = async () => {
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
        this.setState({ profile: data });
      } else {
        this.props.router.push("/login");
      }
    } else {
      this.props.router.push("/login");
    }
  };

  handleLogout = () => {
    localStorage.removeItem("session");
    setTimeout(() => {
      this.props.router.push("/");
    }, 100);
  };

  renderProfileSection = () => {
    if (this.state.profile) {
      return (
        <div className="profile-section">
          <img
            src={this.state.profile.profilePictureUrl || "/images/profiledefault.jpg"}
            alt="Profile Picture"
            className="profile-picture"
          />
          <h2>{this.state.profile.name}</h2>
          <p>{this.state.profile.role}</p>
        </div>
      );
    }
    return null;
  };
}

// Specific Sidebar for Students
class StudentSidebar extends SidebarBase {
  renderLinks = () => (
    <>
      <li><a href="/dashboard/student" onClick={() => this.props.router.push("/dashboard/student")}>Dashboard</a></li>
      <li><a href="/dashboard/profile" onClick={() => this.props.router.push("/dashboard/profile")}>Profile</a></li>
      <li><a href="/dashboard/student/courses" onClick={() => this.props.router.push("/dashboard/student/courses")}>Courses</a></li>
      <li><a href="/dashboard/student/enrolled-courses" onClick={() => this.props.router.push("/dashboard/student/enrolled-courses")}>Enrolled Courses</a></li>
      <li><a href="/dashboard/student/completed-courses" onClick={() => this.props.router.push("/dashboard/student/completed-courses")}>Completed Courses</a></li>
      <li><a href="/student/performance-metrics" onClick={() => this.props.router.push("/dashboard/student/performance-metrics")}>Performance Metrics</a></li>
      <li><a href="/student/search-instructors" onClick={() => this.props.router.push("/dashboard/student/search-instructors")}>Search Instructors</a></li>
    </>
  );

  render() {
    return (
      <aside className="sidebar">
        <div className="notification"></div>
        {this.renderProfileSection()}
        <nav>
          <ul>
            {this.renderLinks()}
            <button className="logout-button">
              <li onClick={this.handleLogout}>Logout</li>
            </button>
          </ul>
        </nav>
      </aside>
    );
  }
}

// Specific Sidebar for Instructors
class InstructorSidebar extends SidebarBase {
  renderLinks = () => (
    <>
      <li><a href="/dashboard/instructor/view-students" onClick={() => this.props.router.push("/dashboard/instructor/view-students")}>View Students</a></li>
      <li><a href="/dashboard/profile" onClick={() => this.props.router.push("/dashboard/profile")}>Profile</a></li>
      <li><a href="/dashboard/instructor/courses" onClick={() => this.props.router.push("/dashboard/instructor/courses")}>Courses</a></li>
      <li><a href="/dashboard/instructor/track-progress" onClick={() => this.props.router.push("/dashboard/instructor/track-progress")}>Track Progress</a></li>
      <li><a href="/dashboard/instructor/analytics" onClick={() => this.props.router.push("/dashboard/instructor/analytics")}>Analytics</a></li>
      <li><a href="/dashboard/instructor/manage-courses" onClick={() => this.props.router.push("/dashboard/instructor/manage-courses")}>Manage Courses</a></li>
    </>
  );

  render() {
    return (
      <aside className="sidebar">
        <div className="notification"></div>
        {this.renderProfileSection()}
        <nav>
          <ul>
            {this.renderLinks()}
            <button className="logout-button">
              <li onClick={this.handleLogout}>Logout</li>
            </button>
          </ul>
        </nav>
      </aside>
    );
  }
}

// Specific Sidebar for Admins
class AdminSidebar extends SidebarBase {
  renderLinks = () => (
    <>
      <li><a href="/dashboard/admin/courses" onClick={() => this.props.router.push("/dashboard/admin/courses")}>Courses</a></li>
      <li><a href="/dashboard/admin/manage-users" onClick={() => this.props.router.push("/dashboard/admin/manage-users")}>Manage Users</a></li>
      <li><a href="/dashboard/admin/data-backup" onClick={() => this.props.router.push("/dashboard/admin/data-backup")}>Data Backup</a></li>
    </>
  );

  render() {
    return (
      <aside className="sidebar">
        <div className="notification"></div>
        {this.renderProfileSection()}
        <nav>
          <ul>
            {this.renderLinks()}
            <button className="logout-button">
              <li onClick={this.handleLogout}>Logout</li>
            </button>
          </ul>
        </nav>
      </aside>
    );
  }
}

// Factory function to determine which sidebar to render based on role
const Sidebar = () => {
  const router = useRouter(); // Get the router from Next.js

  const session = localStorage.getItem("session");
  const profile = session ? JSON.parse(session) : null;

  if (profile?.role === "student") return <StudentSidebar router={router} />;
  if (profile?.role === "instructor") return <InstructorSidebar router={router} />;
  if (profile?.role === "admin") return <AdminSidebar router={router} />;
  return null; // Or handle no logged-in user scenario
};

export default Sidebar;