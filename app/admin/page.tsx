"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type UserWithRole = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

type SessionWithRole = {
  user: UserWithRole;
  [key: string]: unknown;
};

import AdminNavbar from "./components/AdminNavbar";
import AdminStats from "./components/AdminStats";
import UserTable from "./components/UserTable";
import NotificationModal from "./components/NotificationModal";
import UserTableToolbar from "./components/UserTableToolbar";
import Toast from "@/components/Toast";

export default function AdminPage() {
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // Toast state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  // Search, filter, sort state
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | "">("");
  const [sortBy, setSortBy] = useState<"name" | "email" | "createdAt">(
    "createdAt"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const { data: sessionRaw, status } = useSession();
  const session = sessionRaw as SessionWithRole | null;
  const router = useRouter();
  type UserRow = {
    id: string;
    name?: string | null;
    email: string;
    role: string;
    emailVerified?: string | null;
    createdAt?: string | null;
  };
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  // Bulk selection state
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  // Notification modal state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  // Handler to select/deselect a single user
  const handleSelectUser = (userId: string, checked: boolean) => {
    setSelectedUserIds((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  // Handler to select/deselect all users
  const handleSelectAll = (checked: boolean) => {
    setSelectedUserIds(checked ? users.map((u) => u.id) : []);
  };

  // Bulk delete handler (connected to backend)
  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete the selected users? This cannot be undone."
      )
    )
      return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedUserIds }),
      });
      if (!res.ok) {
        const data = await res.json();
        setToast({
          type: "error",
          message: data.error || "Failed to delete users.",
        });
        return;
      }
      setUsers((prev) => prev.filter((u) => !selectedUserIds.includes(u.id)));
      setSelectedUserIds([]);
      setToast({ type: "success", message: "Users deleted successfully." });
    } catch {
      setToast({
        type: "error",
        message: "An error occurred while deleting users.",
      });
    }
  };

  // Send notification handler
  const handleSendNotification = async (message: string) => {
    setNotifLoading(true);
    try {
      const res = await fetch("/api/admin/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedUserIds, message }),
      });
      if (!res.ok) {
        const data = await res.json();
        setToast({
          type: "error",
          message: data.error || "Failed to send notification.",
        });
      } else {
        setToast({ type: "success", message: "Notification sent!" });
        setNotifOpen(false);
      }
    } catch {
      setToast({
        type: "error",
        message: "An error occurred while sending notification.",
      });
    } finally {
      setNotifLoading(false);
    }
  };
  // Auto-hide toast after 3s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.replace("/");
      return;
    }
    // Fetch users
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      });
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
              <div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin mx-auto"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Loading Dashboard
            </h2>
            <p className="text-slate-400">Initializing admin interface...</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter, search, and sort users
  const filteredUsers = users
    .filter(
      (u) =>
        (!search ||
          (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
          (u.email && u.email.toLowerCase().includes(search.toLowerCase()))) &&
        (!roleFilter || u.role === roleFilter)
    )
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") {
        cmp = (a.name || "").localeCompare(b.name || "");
      } else if (sortBy === "email") {
        cmp = (a.email || "").localeCompare(b.email || "");
      } else if (sortBy === "createdAt") {
        cmp =
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime();
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const pagedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <AdminNavbar />
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] animate-fade-in-up">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute top-40 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto py-12 px-4">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              User Management
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Comprehensive user administration and system control center
            </p>
          </div>

          {/* Search, Filter, Sort Controls */}
          <UserTableToolbar
            search={search}
            setSearch={setSearch}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDir={sortDir}
            setSortDir={setSortDir}
            pageSize={pageSize}
            setPageSize={setPageSize}
            setPage={setPage}
          />

          {/* Stats Cards */}
          <AdminStats users={users} />

          {/* Bulk Actions Bar */}
          {selectedUserIds.length > 0 && (
            <div className="mb-4 flex items-center gap-4 bg-slate-800/80 border border-slate-700/50 rounded-xl px-6 py-3 shadow-lg">
              <span className="text-slate-300 font-medium">
                {selectedUserIds.length} selected
              </span>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-all"
                onClick={handleBulkDelete}
              >
                Delete Selected
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition-all"
                onClick={() => setNotifOpen(true)}
              >
                Send Notification
              </button>
            </div>
          )}

          {/* Notification Modal */}
          <NotificationModal
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
            onSend={handleSendNotification}
            loading={notifLoading}
          />

          {/* Main Table */}
          <UserTable
            users={pagedUsers}
            selectedUserIds={selectedUserIds}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
          />

          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
            <div className="flex gap-2 items-center">
              <button
                className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-slate-100 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <span className="text-slate-400 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-slate-100 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
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
        </div>
      </div>
    </div>
  );
}
