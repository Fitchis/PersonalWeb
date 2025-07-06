"use client";

import React, { useEffect, useState } from "react";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch todos saat mount
  useEffect(() => {
    setLoading(true);
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .finally(() => setLoading(false));
  }, []);

  // Tambah todo
  const addTodo = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const res = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ text: input }),
      headers: { "Content-Type": "application/json" },
    });
    let newTodo = null;
    try {
      newTodo = await res.json();
    } catch {
      setLoading(false);
      return;
    }
    if (!res.ok || !newTodo) {
      setLoading(false);
      return;
    }
    setTodos([newTodo, ...todos]);
    setInput("");
    setLoading(false);
  };

  // Toggle done
  const toggleDone = async (id: number, done: boolean) => {
    setLoading(true);
    const res = await fetch("/api/todos", {
      method: "PATCH",
      body: JSON.stringify({ id, done: !done }),
      headers: { "Content-Type": "application/json" },
    });
    const updated = await res.json();
    setTodos(todos.map((todo) => (todo.id === id ? updated : todo)));
    setLoading(false);
  };

  // Hapus todo
  const removeTodo = async (id: number) => {
    setLoading(true);
    await fetch("/api/todos", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    setTodos(todos.filter((todo) => todo.id !== id));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Todo List
        </h1>

        <div className="mb-8 flex gap-3">
          <input
            type="text"
            placeholder="Tambah todo..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
          />
          <button
            onClick={addTodo}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "Tambah"}
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            <span className="ml-2 text-gray-400">Loading...</span>
          </div>
        )}

        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 group"
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleDone(todo.id, todo.done)}
                disabled={loading}
                className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 focus:ring-offset-gray-900 disabled:opacity-50"
              />
              <span
                className={`flex-1 transition-all duration-200 ${
                  todo.done ? "line-through text-gray-500" : "text-white"
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => removeTodo(todo.id)}
                disabled={loading}
                className="px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-all duration-200 disabled:opacity-50 opacity-0 group-hover:opacity-100"
              >
                Hapus
              </button>
            </div>
          ))}

          {todos.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📝</div>
              <p>Belum ada todo. Tambahkan satu!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
