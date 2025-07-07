"use client";

import React, { useEffect, useState, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import Toast from "./Toast";

interface Todo {
  id: number;
  text: string;
  done: boolean;
  deadline?: string | null;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [deadline, setDeadline] = useState<string>("");
  const deadlineInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (deadlineInputRef.current) {
      flatpickr(deadlineInputRef.current, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        time_24hr: true,
        minDate: "today",
        defaultDate: deadline || undefined,
        onChange: (selectedDates) => {
          if (selectedDates[0]) {
            setDeadline(selectedDates[0].toISOString());
          }
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch todos saat mount
  useEffect(() => {
    setLoading(true);
    fetch("/api/todos")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data");
        return res.json();
      })
      .then((data) => setTodos(data))
      .catch(() => setToast({ message: "Gagal memuat data", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  // Reminder Toast jika ada todo deadline <24 jam, belum selesai, belum lewat
  useEffect(() => {
    if (!todos.length) return;
    const now = new Date();
    const soonTodos = todos.filter(
      (todo) =>
        todo.deadline &&
        !todo.done &&
        (() => {
          const d = new Date(todo.deadline!);
          const diff = d.getTime() - now.getTime();
          return diff > 0 && diff < 1000 * 60 * 60 * 24;
        })()
    );
    if (soonTodos.length > 0) {
      setToast({
        message: `Ada ${soonTodos.length} todo yang deadline-nya kurang dari 24 jam!`,
        type: "error",
      });
    }
    // hanya sekali per load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos]);

  // Drag & drop handler
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const newTodos = Array.from(todos);
    const [removed] = newTodos.splice(result.source.index, 1);
    newTodos.splice(result.destination.index, 0, removed);
    setTodos(newTodos);
    // Kirim urutan baru ke backend
    try {
      const res = await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newTodos.map((t) => t.id) }),
      });
      if (!res.ok) throw new Error();
      setToast({ message: "Urutan todo diperbarui", type: "success" });
    } catch {
      setToast({ message: "Gagal update urutan todo", type: "error" });
    }
  };

  // Tambah todo
  const addTodo = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const res = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({
        text: input,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
      }),
      headers: { "Content-Type": "application/json" },
    });
    let newTodo = null;
    try {
      newTodo = await res.json();
    } catch {
      setToast({ message: "Gagal menambah todo", type: "error" });
      setLoading(false);
      return;
    }
    if (!res.ok || !newTodo) {
      setToast({
        message: newTodo?.error || "Gagal menambah todo",
        type: "error",
      });
      setLoading(false);
      return;
    }
    setTodos([newTodo, ...todos]);
    setInput("");
    setDeadline("");
    setToast({ message: "Todo berhasil ditambahkan!", type: "success" });
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
    let updated = null;
    try {
      updated = await res.json();
    } catch {
      setToast({ message: "Gagal update todo", type: "error" });
      setLoading(false);
      return;
    }
    if (!res.ok || !updated) {
      setToast({
        message: updated?.error || "Gagal update todo",
        type: "error",
      });
      setLoading(false);
      return;
    }
    setTodos(todos.map((todo) => (todo.id === id ? updated : todo)));
    setToast({ message: "Todo diperbarui", type: "success" });
    setLoading(false);
  };

  // Hapus todo
  const removeTodo = async (id: number) => {
    setLoading(true);
    const res = await fetch("/api/todos", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      setToast({ message: "Gagal menghapus todo", type: "error" });
      setLoading(false);
      return;
    }
    setTodos(todos.filter((todo) => todo.id !== id));
    setToast({ message: "Todo dihapus", type: "success" });
    setLoading(false);
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(156,163,175,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(107,114,128,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:50px_50px] animate-pulse"></div>
        </div>
        <div className="max-w-2xl mx-auto relative z-10">
          <h1 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
            Todo List
          </h1>
          <p className="text-gray-400 mb-6 text-center">
            list dapat di drag & drop
          </p>

          <div className="mb-8 flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Tambah todo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gray-900/60 border border-gray-700/60 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 disabled:opacity-50"
            />
            <input
              ref={deadlineInputRef}
              type="text"
              value={deadline ? new Date(deadline).toLocaleString() : ""}
              onChange={() => {}}
              placeholder="Pilih deadline (opsional)"
              disabled={loading}
              className="w-full md:w-64 appearance-none px-4 py-3 bg-gray-900/60 border border-gray-700/60 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 disabled:opacity-50 cursor-pointer"
              readOnly
            />

            <button
              onClick={addTodo}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600"
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

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="todo-list">
              {(provided) => (
                <div
                  className="space-y-3"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {todos.map((todo, idx) => {
                    // Reminder visual
                    let deadlineBadge = null;
                    if (todo.deadline) {
                      const deadlineDate = new Date(todo.deadline);
                      const now = new Date();
                      const diff = deadlineDate.getTime() - now.getTime();
                      let badgeColor = "bg-gray-600";
                      let badgeText = deadlineDate.toLocaleString();
                      if (diff < 0) {
                        badgeColor = "bg-red-600";
                        badgeText = `Lewat deadline (${deadlineDate.toLocaleString()})`;
                      } else if (diff < 1000 * 60 * 60 * 24) {
                        badgeColor = "bg-yellow-500 text-black";
                        badgeText = `Deadline hari ini (${deadlineDate.toLocaleString()})`;
                      }
                      deadlineBadge = (
                        <span
                          className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${badgeColor}`}
                        >
                          {badgeText}
                        </span>
                      );
                    }
                    return (
                      <Draggable
                        key={todo.id}
                        draggableId={todo.id.toString()}
                        index={idx}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center gap-4 p-4 bg-gray-900/60 rounded-lg border border-gray-700/60 hover:border-gray-400 transition-all duration-200 group ${
                              snapshot.isDragging ? "ring-2 ring-gray-400" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={todo.done}
                              onChange={() => toggleDone(todo.id, todo.done)}
                              disabled={loading}
                              className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 focus:ring-offset-gray-900 disabled:opacity-50"
                            />
                            <span
                              className={`flex-1 min-w-0 transition-all duration-200 ${
                                todo.done
                                  ? "line-through text-gray-500"
                                  : "text-white"
                              }`}
                              style={{ wordBreak: "break-word" }}
                            >
                              <span
                                className="block truncate max-w-full"
                                title={todo.text}
                              >
                                {todo.text}
                              </span>
                              {deadlineBadge}
                            </span>
                            <button
                              onClick={() => removeTodo(todo.id)}
                              disabled={loading}
                              className="px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-all duration-200 disabled:opacity-50 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                            >
                              <span className="inline md:hidden">🗑️</span>
                              <span className="hidden md:inline">Hapus</span>
                            </button>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  {todos.length === 0 && !loading && (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-6xl mb-4">📝</div>
                      <p>Belum ada todo. Tambahkan satu!</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default TodoList;
