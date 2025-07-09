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
import Toast from "../Toast";

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
  // State untuk multiple select
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  // Toggle select todo
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Select all
  const selectAll = () => {
    setSelectedIds(new Set(todos.map((t) => t.id)));
    setSelectMode(true);
  };
  // Deselect all
  const deselectAll = () => {
    setSelectedIds(new Set());
    setSelectMode(false);
  };

  // Hapus multiple
  const removeSelectedTodos = async () => {
    if (selectedIds.size === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/todos", {
        method: "DELETE",
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error();
      setTodos(todos.filter((todo) => !selectedIds.has(todo.id)));
      setToast({
        message: `Successfully deleted ${selectedIds.size} todo(s)`,
        type: "success",
      });
      setSelectedIds(new Set());
    } catch {
      setToast({ message: "Failed to delete selected todos", type: "error" });
    }
    setLoading(false);
  };

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
        if (!res.ok) throw new Error("Failed to load data");
        return res.json();
      })
      .then((data) => setTodos(data))
      .catch(() => setToast({ message: "Failed to load data", type: "error" }))
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
        message: `There are ${soonTodos.length} todo(s) with less than 24 hours left until the deadline!`,
        type: "error",
      });
      // Trigger persistent notification for soon todos
      fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `There are ${soonTodos.length} todo(s) with less than 24 hours left until the deadline!`,
          type: "task",
          link: "/#todo",
        }),
      });
    }
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
      setToast({ message: "Todo order updated", type: "success" });
    } catch {
      setToast({ message: "Failed to update todo order", type: "error" });
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
      setToast({ message: "Failed to add todo", type: "error" });
      setLoading(false);
      return;
    }
    if (!res.ok || !newTodo) {
      setToast({
        message: newTodo?.error || "Failed to add todo",
        type: "error",
      });
      setLoading(false);
      return;
    }
    setTodos([newTodo, ...todos]);
    setInput("");
    setDeadline("");
    setToast({ message: "Todo added successfully!", type: "success" });
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
      setToast({ message: "Failed to update todo", type: "error" });
      setLoading(false);
      return;
    }
    if (!res.ok || !updated) {
      setToast({
        message: updated?.error || "Failed to update todo",
        type: "error",
      });
      setLoading(false);
      return;
    }
    setTodos(todos.map((todo) => (todo.id === id ? updated : todo)));
    setToast({ message: "Todo updated", type: "success" });
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
      setToast({ message: "Failed to delete todo", type: "error" });
      setLoading(false);
      return;
    }
    setTodos(todos.filter((todo) => todo.id !== id));
    setToast({ message: "Todo deleted", type: "success" });
    setLoading(false);
  };

  return (
    <>
      <div className="min-h-screen overflow-hidden p-6 bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-gray-600/70 hover:bg-gray-800/70">
        {/* <div className="min-h-screen rounded-2xl bg-black text-white p-8 relative overflow-hidden"> */}
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(156,163,175,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(107,114,128,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:50px_50px] animate-pulse"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
            Todo List
          </h1>
          <p className="text-gray-400 mb-6 text-center">
            List can be dragged & dropped
          </p>

          <div className="mb-8 flex flex-col gap-3">
            {/* Toolbar for select/deselect/delete multiple */}
            <div className="flex flex-wrap gap-2 items-center justify-between mb-2">
              <div className="flex gap-2">
                {!selectMode ? (
                  <button
                    type="button"
                    onClick={() => setSelectMode(true)}
                    className="px-3 py-2 text-xs bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 border border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    disabled={loading || todos.length === 0}
                  >
                    Select Item
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={selectAll}
                      className="px-3 py-2 text-xs bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 border border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      disabled={loading || todos.length === 0}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={deselectAll}
                      className="px-3 py-2 text-xs bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 border border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      disabled={loading || selectedIds.size === 0}
                    >
                      Cancel Selection
                    </button>
                    <button
                      type="button"
                      onClick={removeSelectedTodos}
                      className="px-3 py-2 text-xs bg-red-700 text-white rounded-lg hover:bg-red-600 border border-red-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                      disabled={loading || selectedIds.size === 0}
                    >
                      <span className="hidden sm:inline">Delete Selected</span>
                      <span className="inline sm:hidden">🗑️</span>
                    </button>
                  </>
                )}
              </div>
              {selectMode && selectedIds.size > 0 && (
                <span className="text-xs text-cyan-400 font-semibold ml-2">
                  {selectedIds.size} selected
                </span>
              )}
            </div>
            {/* Todo input and deadline input horizontal */}
            <div className="flex flex-col md:flex-row gap-3 w-full">
              <input
                type="text"
                placeholder="Add todo..."
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
                placeholder="Pick deadline (optional)"
                disabled={loading}
                className="w-full md:w-64 appearance-none px-4 py-3 bg-gray-900/60 border border-gray-700/60 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                readOnly
              />
              <button
                onClick={addTodo}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600"
              >
                {loading ? "..." : "Add"}
              </button>
            </div>
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
                      let badgeClass =
                        "bg-gray-700 text-cyan-200 border border-cyan-700";
                      let badgeText = deadlineDate.toLocaleString();
                      if (diff < 0) {
                        badgeClass =
                          "bg-red-100 text-red-700 border border-red-400";
                        badgeText = `Past deadline (${deadlineDate.toLocaleString()})`;
                      } else if (diff < 1000 * 60 * 60 * 24) {
                        badgeClass =
                          "bg-yellow-100 text-yellow-900 border border-yellow-400 animate-pulse";
                        badgeText = `Due today (${deadlineDate.toLocaleString()})`;
                      }
                      deadlineBadge = (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm ${badgeClass}`}
                          style={{ minWidth: 0, display: "inline-block" }}
                        >
                          <svg
                            className="inline mr-1 mb-0.5"
                            width="14"
                            height="14"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V6h2v4z" />
                          </svg>
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
                            {/* Checkbox select multiple (hanya muncul jika selectMode aktif) */}
                            {selectMode && (
                              <input
                                type="checkbox"
                                checked={selectedIds.has(todo.id)}
                                onChange={() => toggleSelect(todo.id)}
                                disabled={loading}
                                className="w-5 h-5 text-cyan-400 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2 focus:ring-offset-gray-900 disabled:opacity-50 mr-2"
                                aria-label="Pilih todo"
                                tabIndex={0}
                              />
                            )}
                            {/* Checkbox done (custom style) */}
                            <label className="relative inline-flex items-center cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={todo.done}
                                onChange={() => toggleDone(todo.id, todo.done)}
                                disabled={loading}
                                className="peer sr-only"
                                aria-label="Selesai"
                                tabIndex={0}
                              />
                              <span className="w-5 h-5 flex items-center justify-center rounded border-2 border-purple-500 bg-gray-800 transition-colors duration-200 peer-checked:bg-purple-600 peer-checked:border-purple-600 peer-disabled:opacity-50">
                                <svg
                                  className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </span>
                            </label>
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
                              <span className="hidden md:inline">Delete</span>
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
                      <p>No todos yet. Add one!</p>
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
