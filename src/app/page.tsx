"use client";

import { useRouter } from "next/navigation";
import "./globals.css";

export default function Home() {
  const router = useRouter();

  return (
    <main className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen flex items-center justify-center">
      <div className="flex-grow flex flex-col w-full">
        {" "}
        {/* Added w-full */}
        <section className="bg-gradient-to-r from-indigo-800 via-purple-900 to-indigo-800 py-24 px-6 md:px-12 lg:px-24 text-white flex-grow flex items-center justify-center">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6 drop-shadow-lg text-gray-200">
              Unlock Your Potential
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed text-gray-300">
              Explore a world of knowledge and skills with our diverse online
              courses. Join a vibrant community of learners and embark on your
              learning journey today.
            </p>
            <div className="flex justify-center space-x-6">
              <button
                className="bg-gray-200 text-indigo-900 font-bold py-3 px-8 rounded-lg hover:bg-indigo-100 hover:scale-105 transition duration-300 shadow-lg"
                onClick={() => router.push("/login")}>
                Login
              </button>
              <button
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-8 rounded-lg hover:scale-105 transition duration-300 shadow-lg"
                onClick={() => router.push("/register")}>
                Register
              </button>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-6 px-4 text-center mt-auto">
          <p>
            &copy; {new Date().getFullYear()} Your Company Name. All rights
            reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
