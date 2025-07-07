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
        if (!res.ok) throw new Error("Gagal memuat data");
        return res.json();
      })
      .then((data) => setApplications(data))
      .catch(() => setToast({ message: "Gagal memuat data", type: "error" }))
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
      setToast({ message: "Gagal menambah aplikasi", type: "error" });
      setLoading(false);
      return;
    }
    if (!res.ok || !newApp) {
      setToast({
        message: newApp?.error || "Gagal menambah aplikasi",
        type: "error",
      });
      setLoading(false);
      return;
    }
    setApplications([newApp, ...applications]);
    setCompany("");
    setPosition("");
    setStatus("pending");
    setToast({ message: "Aplikasi berhasil ditambahkan!", type: "success" });
    setLoading(false);
  };

  // Update status aplikasi
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
      setToast({ message: "Gagal update status", type: "error" });
      setLoading(false);
      return;
    }
    if (!res.ok || !updated) {
      setToast({
        message: updated?.error || "Gagal update status",
        type: "error",
      });
      setLoading(false);
      return;
    }
    setApplications(applications.map((app) => (app.id === id ? updated : app)));
    setToast({ message: "Status aplikasi diperbarui", type: "success" });
    setLoading(false);
  };

  // Hapus aplikasi
  const removeApplication = async (id: number) => {
    setLoading(true);
    const res = await fetch("/api/jobs", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      setToast({ message: "Gagal menghapus aplikasi", type: "error" });
      setLoading(false);
      return;
    }
    setApplications(applications.filter((app) => app.id !== id));
    setToast({ message: "Aplikasi dihapus", type: "success" });
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
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Job Application Tracker
          </h1>

          {/* Add Application Form */}
          <div className="mb-8 p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">
              Tambah Aplikasi Baru
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Nama perusahaan"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={loading}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
              />
              <input
                type="text"
                placeholder="Posisi yang dilamar"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                disabled={loading}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                disabled={loading}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
              >
                <option value="pending">Pending</option>
                <option value="accept">Accept</option>
                <option value="reject">Reject</option>
              </select>
              <button
                onClick={addApplication}
                disabled={loading || !company.trim() || !position.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "Tambah"}
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
              <span className="ml-3 text-gray-400">Loading...</span>
            </div>
          )}

          {/* Applications Table */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700 border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Perusahaan
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Posisi
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {applications.map((app, index) => (
                    <tr
                      key={app.id ? `jobapp-${app.id}` : `jobapp-row-${index}`}
                      className={`hover:bg-gray-750 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-825"
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
                              ? "Diterima"
                              : app.status === "reject"
                              ? "Ditolak"
                              : "Pending"}
                          </span>
                          <select
                            value={app.status}
                            onChange={(e) =>
                              updateStatus(app.id, e.target.value as Status)
                            }
                            disabled={loading}
                            className="ml-2 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
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
                          🗑️ Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {applications.length === 0 && !loading && (
              <div className="text-center py-16 px-6">
                <div className="text-6xl mb-4">💼</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Belum ada aplikasi pekerjaan
                </h3>
                <p className="text-gray-500">
                  Mulai tambahkan aplikasi pekerjaan Anda untuk melacak status
                  lamaran.
                </p>
              </div>
            )}
          </div>

          {/* Stats Summary */}
          {applications.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="text-3xl text-yellow-400 mr-3">⏳</div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {
                        applications.filter((app) => app.status === "pending")
                          .length
                      }
                    </div>
                    <div className="text-sm text-gray-400">Pending</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="text-3xl text-green-400 mr-3">✓</div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {
                        applications.filter((app) => app.status === "accept")
                          .length
                      }
                    </div>
                    <div className="text-sm text-gray-400">Diterima</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="text-3xl text-red-400 mr-3">✗</div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {
                        applications.filter((app) => app.status === "reject")
                          .length
                      }
                    </div>
                    <div className="text-sm text-gray-400">Ditolak</div>
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
