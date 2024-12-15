// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 py-24 px-6 md:px-12 lg:px-24 text-white flex-grow flex items-center justify-center">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6 drop-shadow-lg">
            Unlock Your Potential
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Explore a world of knowledge and skills with our diverse online
            courses. Join a vibrant community of learners and embark on your
            learning journey today.
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/login" className="inline-block">
              <button className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 hover:scale-105 transition duration-300 shadow-md">
                Login
              </button>
            </Link>
            <Link href="/register" className="inline-block">
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:scale-105 transition duration-300 shadow-md">
                Register
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer (Optional, but recommended) */}
      <footer className="bg-gray-800 text-gray-400 py-6 px-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} Your Company Name. All rights
          reserved.
        </p>
      </footer>
    </main>
  );
}
