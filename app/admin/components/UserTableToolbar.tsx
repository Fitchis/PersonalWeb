"use client";
import React from "react";

interface UserTableToolbarProps {
  search: string;
  setSearch: (v: string) => void;
  roleFilter: string;
  setRoleFilter: (v: string) => void;
  sortBy: "name" | "email" | "createdAt";
  setSortBy: (v: "name" | "email" | "createdAt") => void;
  sortDir: "asc" | "desc";
  setSortDir: (v: "asc" | "desc") => void;
  pageSize: number;
  setPageSize: (n: number) => void;
  setPage: (n: number) => void;
}

const UserTableToolbar: React.FC<UserTableToolbarProps> = ({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
  pageSize,
  setPageSize,
  setPage,
}) => (
  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
    <input
      type="text"
      className="w-full md:w-64 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Search by name or email..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <select
      className="w-full md:w-48 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={roleFilter}
      onChange={(e) => setRoleFilter(e.target.value)}
    >
      <option value="">All Roles</option>
      <option value="ADMIN">Admin</option>
      <option value="USER">User</option>
    </select>
    <div className="flex gap-2 items-center">
      <label className="text-slate-400 text-sm">Sort by:</label>
      <select
        className="px-2 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none"
        value={sortBy}
        onChange={(e) =>
          setSortBy(e.target.value as "name" | "email" | "createdAt")
        }
      >
        <option value="createdAt">Joined</option>
        <option value="name">Name</option>
        <option value="email">Email</option>
      </select>
      <button
        className="px-2 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 hover:bg-slate-700"
        onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
        title="Toggle sort direction"
      >
        {sortDir === "asc" ? "↑" : "↓"}
      </button>
    </div>
    <div className="flex gap-2 items-center">
      <label className="text-slate-400 text-sm">Rows per page:</label>
      <select
        className="px-2 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none"
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
          setPage(1);
        }}
      >
        {[5, 10, 20, 50, 100].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default UserTableToolbar;
