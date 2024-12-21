// src/app/page.tsx

"use client";

import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/dist/client/link";
import "./globals.css";
export default function Home() {
  const router = useRouter();

  return (
    <main className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
      <div className="flex-grow flex flex-col w-full">
        <section className="bg-gradient-to-r from-indigo-800 via-purple-900 to-indigo-800 py-24 px-6 md:px-12 lg:px-24 text-white flex-grow flex items-center justify-center">
          <div className="container mx-auto text-center relative">
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

            <div className="absolute top-1/2 right-10 md:right-20 lg:right-32 transform -translate-y-1/2"></div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gray-800 text-white py-12 px-6 md:px-12 lg:px-24">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Build your skills with our certificated online courses, and
              achieve your goals!
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Benefit 1: AI-Powered Recommendations */}
              <div className="md:w-1/2">
                <h3 className="text-xl font-bold mb-2">
                  Personalized Learning with AI
                </h3>
                <Image
                  src="/images/main4.jpg"
                  alt="Personalized Learning with AI"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg mb-4"
                />
                <p className="text-gray-300">
                  Experience the power of personalized learning! Our AI-powered
                  recommendation system analyzes your interests and learning
                  patterns to suggest the most relevant courses for you.
                  Discover new topics, expand your skills, and achieve your
                  goals with tailored recommendations.
                </p>
              </div>

              {/* Benefit 2: Quizzes and Practical Exercises */}
              <div className="md:w-1/2">
                <h3 className="text-xl font-bold mb-2">
                  Interactive Quizzes and Exercises
                </h3>
                <Image
                  src="/images/mainpage.png"
                  alt="Quizzes and Practical Exercises"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg mb-4"
                />
                <p className="text-gray-300">
                  Reinforce your learning and test your understanding with
                  interactive quizzes and practical exercises. Our courses are
                  designed to be engaging and hands-on, ensuring you gain
                  practical skills and knowledge that you can apply immediately.
                </p>
              </div>

              {/* Add more benefits here (3 to 6) in a similar format */}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="container mx-auto py-10 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Ready to start your learning journey?
          </h2>
          <Link href="/register">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
              Join Now
            </button>
          </Link>
        </section>

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
