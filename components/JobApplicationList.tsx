"use client";

import React, { useEffect, useState } from "react";
import Toast from "./Toast";

type Status = "accept" | "reject" | "pending";

interface JobApplication {
  id: number;
  company: string;
  position: string;
  status: Status;
}

const JobApplicationList: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState<Status>("pending");
  const [loading, setLoading] = useState(false);
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

  // Fetch jobs saat mount
  useEffect(() => {
    setLoading(true);
    fetch("/api/jobs")
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching jobs");
        return res.json();
      })
      .then((data) => setApplications(data))
      .catch(() => setToast({ message: "Error fetching jobs", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  // Tambah aplikasi
  const addApplication = async () => {
    if (!company.trim() || !position.trim()) return;
    setLoading(true);
    const res = await fetch("/api/jobs", {
      method: "POST",
      body: JSON.stringify({ company, position, status }),
      headers: { "Content-Type": "application/json" },
    });
    let newApp = null;
    try {
      newApp = await res.json();
    } catch {
      setToast({ message: "Failed to add application", type: "error" });
      setLoading(false);
      return;
    }
    if (!res.ok || !newApp) {
      setToast({
        message: newApp?.error || "Failed to add application",
        type: "error",
      });
      setLoading(false);
      return;
    }
    setApplications([newApp, ...applications]);
    setCompany("");
    setPosition("");
    setStatus("pending");
    setToast({ message: "Application added successfully!", type: "success" });
    setLoading(false);
  };

  // Update status application
  const updateStatus = async (id: number, newStatus: Status) => {
    setLoading(true);
    const res = await fetch("/api/jobs", {
      method: "PATCH",
      body: JSON.stringify({ id, status: newStatus }),
      headers: { "Content-Type": "application/json" },
    });
    let updated = null;
    try {
      updated = await res.json();
    } catch {
      setToast({ message: "Failed to update status", type: "error" });
      setLoading(false);
      return;
    }
    if (!res.ok || !updated) {
      setToast({
        message: updated?.error || "Failed to update status",
        type: "error",
      });
      setLoading(false);
      return;
    }
    setApplications(applications.map((app) => (app.id === id ? updated : app)));
    setToast({ message: "Application status updated", type: "success" });
    setLoading(false);
  };

  // Delete aplikasi
  const removeApplication = async (id: number) => {
    setLoading(true);
    const res = await fetch("/api/jobs", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      setToast({ message: "Failed to delete application", type: "error" });
      setLoading(false);
      return;
    }
    setApplications(applications.filter((app) => app.id !== id));
    setToast({ message: "Application deleted", type: "success" });
    setLoading(false);
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "accept":
        return "bg-emerald-500 text-white";
      case "reject":
        return "bg-red-500 text-white";
      case "pending":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "accept":
        return "✓";
      case "reject":
        return "✗";
      case "pending":
        return "⏳";
      default:
        return "?";
    }
  };

  return (
    <>
      {/* className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-gray-600/70 hover:bg-gray-800/70" */}
      <div className="min-h-screen bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-gray-600/70 hover:bg-gray-800/70 text-white p-4 sm:p-6 md:p-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(156,163,175,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(107,114,128,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:50px_50px] animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
            Job Application Tracker
          </h1>

          {/* Add Application Form */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-900/60 rounded-xl border border-gray-700/60 shadow-xl backdrop-blur-sm">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-200">
              Add New Application Job
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={loading}
                className="px-3 py-2 sm:px-4 sm:py-3 bg-gray-900/60 border border-gray-700/60 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 disabled:opacity-50"
              />
              <input
                type="text"
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                disabled={loading}
                className="px-3 py-2 sm:px-4 sm:py-3 bg-gray-900/60 border border-gray-700/60 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 disabled:opacity-50"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                disabled={loading}
                className="px-3 py-2 sm:px-4 sm:py-3 bg-gray-900/60 border border-gray-700/60 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 disabled:opacity-50"
              >
                <option value="pending">Pending</option>
                <option value="accept">Accept</option>
                <option value="reject">Reject</option>
              </select>
              <button
                onClick={addApplication}
                disabled={loading || !company.trim() || !position.trim()}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg font-semibold text-sm sm:text-base hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600"
              >
                {loading ? "..." : "Add"}
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-400"></div>
              <span className="ml-3 text-gray-400">Loading...</span>
            </div>
          )}

          {/* Applications Table */}
          <div className="bg-gray-900/60 rounded-xl border border-gray-700/60 shadow-xl overflow-hidden backdrop-blur-sm">
            {/* Responsive Table for Desktop, Cards for Mobile */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 border-b border-gray-700/60">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/80">
                  {applications.map((app, index) => (
                    <tr
                      key={app.id ? `jobapp-${app.id}` : `jobapp-row-${index}`}
                      className={`hover:bg-gray-800/60 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-gray-900/60" : "bg-gray-900/40"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {app.company}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {app.position}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              app.status
                            )}`}
                          >
                            <span className="mr-1">
                              {getStatusIcon(app.status)}
                            </span>
                            {app.status === "accept"
                              ? "Accepted"
                              : app.status === "reject"
                              ? "Rejected"
                              : "Pending"}
                          </span>
                          <select
                            value={app.status}
                            onChange={(e) =>
                              updateStatus(app.id, e.target.value as Status)
                            }
                            disabled={loading}
                            className="ml-2 px-2 py-1 bg-gray-900/60 border border-gray-700/60 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50"
                          >
                            <option value="pending">Pending</option>
                            <option value="accept">Accept</option>
                            <option value="reject">Reject</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => removeApplication(app.id)}
                          disabled={loading}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-1 rounded transition-all duration-200 disabled:opacity-50"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-gray-800/80">
              {applications.map((app, index) => (
                <div
                  key={
                    app.id ? `jobapp-mob-${app.id}` : `jobapp-mob-row-${index}`
                  }
                  className={`flex flex-col gap-2 py-4 px-3 ${
                    index % 2 === 0 ? "bg-gray-900/60" : "bg-gray-900/40"
                  } rounded-none`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-semibold text-white">
                      {app.company}
                    </span>
                    <button
                      onClick={() => removeApplication(app.id)}
                      disabled={loading}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-2 py-1 rounded text-xs transition-all duration-200 disabled:opacity-50"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  <div className="text-sm text-gray-300 mb-1">
                    {app.position}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        app.status
                      )}`}
                    >
                      <span className="mr-1">{getStatusIcon(app.status)}</span>
                      {app.status === "accept"
                        ? "Accepted"
                        : app.status === "reject"
                        ? "Rejected"
                        : "Pending"}
                    </span>
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateStatus(app.id, e.target.value as Status)
                      }
                      disabled={loading}
                      className="ml-2 px-2 py-1 bg-gray-900/60 border border-gray-700/60 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="accept">Accept</option>
                      <option value="reject">Reject</option>
                    </select>
                  </div>
                </div>
              ))}
              {/* Empty State for Mobile */}
              {applications.length === 0 && !loading && (
                <div className="text-center py-12 px-4">
                  <div className="text-5xl mb-3">💼</div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-1">
                    No job applications yet
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Start adding your job applications to track their status.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Summary */}
          {applications.length > 0 && (
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gray-900/60 rounded-xl p-4 sm:p-6 border border-gray-700/60 backdrop-blur-sm flex items-center gap-3">
                <div className="text-2xl sm:text-3xl text-yellow-400">⏳</div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {
                      applications.filter((app) => app.status === "pending")
                        .length
                    }
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    Pending
                  </div>
                </div>
              </div>
              <div className="bg-gray-900/60 rounded-xl p-4 sm:p-6 border border-gray-700/60 backdrop-blur-sm flex items-center gap-3">
                <div className="text-2xl sm:text-3xl text-green-400">✓</div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {
                      applications.filter((app) => app.status === "accept")
                        .length
                    }
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    Accepted
                  </div>
                </div>
              </div>
              <div className="bg-gray-900/60 rounded-xl p-4 sm:p-6 border border-gray-700/60 backdrop-blur-sm flex items-center gap-3">
                <div className="text-2xl sm:text-3xl text-red-400">✗</div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {
                      applications.filter((app) => app.status === "reject")
                        .length
                    }
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    Rejected
                  </div>
                </div>
              </div>
            </div>
          )}
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

export default JobApplicationList;
