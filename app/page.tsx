import React from "react";
import TodoList from "../components/TodoList";
import JobApplicationList from "../components/JobApplicationList";
import AuthButton from "../components/AuthButton";
import { RequireAuth } from "../components/RequireAuth";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Personal Dashboard
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Manage your tasks and track your job applications all in one place
          </p>
          <div className="mt-6 flex justify-center">
            <AuthButton />
          </div>
        </header>

        {/* Todo Section */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <div className="text-3xl mr-4">📝</div>
            <h2 className="text-3xl font-semibold text-white">Todo List</h2>
          </div>
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
            {/* <RequireAuth> */}
            <TodoList />
            {/* </RequireAuth> */}
          </div>
        </section>

        {/* Job Applications Section */}
        <section>
          <div className="flex items-center mb-8">
            <div className="text-3xl mr-4">💼</div>
            <h2 className="text-3xl font-semibold text-white">
              Lamaran Pekerjaan
            </h2>
          </div>
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
            <RequireAuth>
              <JobApplicationList />
            </RequireAuth>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-16 py-8 border-t border-gray-800">
          <p className="text-gray-500">
            Built with React & Tailwind CSS • Dark Theme
          </p>
        </footer>
      </div>
    </main>
  );
}
