import React from "react";

type UserRow = {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  emailVerified?: string | null;
  createdAt?: string | null;
};

interface UserTableProps {
  users: UserRow[];
  selectedUserIds?: string[];
  onSelectUser?: (userId: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedUserIds = [],
  onSelectUser,
  onSelectAll,
}) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-300 mb-3">
          No Users Found
        </h3>
        <p className="text-slate-500 text-lg">
          The user directory is currently empty.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl shadow-lg border border-slate-700/30 bg-slate-900/20 backdrop-blur-xl">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl border-b border-slate-600/30">
            <th className="py-6 px-4 text-left">
              {/* Select All Checkbox */}
              {onSelectAll && (
                <input
                  type="checkbox"
                  className="accent-blue-500 w-5 h-5 rounded"
                  checked={
                    users.length > 0 && selectedUserIds.length === users.length
                  }
                  onChange={(e) => onSelectAll(e.target.checked)}
                  aria-label="Select all users"
                />
              )}
            </th>
            <th className="py-6 px-8 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-300 tracking-wider uppercase">
                  User
                </span>
              </div>
            </th>
            <th className="py-6 px-8 text-left">
              <span className="text-sm font-bold text-slate-300 tracking-wider uppercase">
                Email
              </span>
            </th>
            <th className="py-6 px-8 text-left">
              <span className="text-sm font-bold text-slate-300 tracking-wider uppercase">
                Role
              </span>
            </th>
            <th className="py-6 px-8 text-left">
              <span className="text-sm font-bold text-slate-300 tracking-wider uppercase">
                Status
              </span>
            </th>
            <th className="py-6 px-8 text-left">
              <span className="text-sm font-bold text-slate-300 tracking-wider uppercase">
                Joined
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {users.map((user, index) => (
            <tr
              key={user.id}
              className={`group hover:bg-gradient-to-r hover:from-slate-800/30 hover:to-slate-700/30 transition-all duration-300 ${
                index % 2 === 0 ? "bg-slate-900/20" : "bg-slate-800/20"
              }`}
            >
              <td className="py-6 px-4">
                {/* Row Checkbox */}
                {onSelectUser && (
                  <input
                    type="checkbox"
                    className="accent-blue-500 w-5 h-5 rounded"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={(e) => onSelectUser(user.id, e.target.checked)}
                    aria-label={`Select user ${user.name || user.email}`}
                  />
                )}
              </td>
              <td className="py-6 px-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl ${
                        user.role === "ADMIN"
                          ? "bg-gradient-to-br from-red-500 to-red-600"
                          : "bg-gradient-to-br from-blue-500 to-purple-600"
                      }`}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    {user.emailVerified && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {user.name || "Unknown User"}
                    </div>
                    <div className="text-sm text-slate-400">
                      ID: {user.id.slice(0, 8)}...
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-6 px-8">
                <div className="text-slate-300 font-medium">{user.email}</div>
              </td>
              <td className="py-6 px-8">
                <span
                  className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
                    user.role === "ADMIN"
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="py-6 px-8">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      user.emailVerified
                        ? "bg-green-500 animate-pulse"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <span
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${
                      user.emailVerified
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    {user.emailVerified ? "Verified" : "Pending"}
                  </span>
                </div>
              </td>
              <td className="py-6 px-8">
                <div className="text-slate-400 font-medium">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Unknown"}
                </div>
                <div className="text-xs text-slate-500">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
