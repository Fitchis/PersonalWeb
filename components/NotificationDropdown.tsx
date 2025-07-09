"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "task"
  | "job"
  | "custom";

export type Notification = {
  id: number;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type?: NotificationType;
  link?: string;
};

interface NotificationDropdownProps {
  notificationCount: number;
  setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notificationCount,
  setNotificationCount,
}) => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notification list when dropdown is opened
  useEffect(() => {
    if (!showDropdown) return;
    const fetchNotificationList = async () => {
      try {
        const res = await fetch("/api/notifications/list");
        if (!res.ok) return;
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch {}
    };
    fetchNotificationList();
  }, [showDropdown]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  if (!session?.user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200"
        onClick={() => setShowDropdown((v) => !v)}
        aria-label="Show notifications"
      >
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
            {notificationCount}
          </span>
        )}
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 max-w-xs bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 animate-fade-in overflow-hidden">
          <div className="p-3 border-b border-gray-800 font-semibold text-gray-200 bg-gray-950/80 flex justify-between items-center">
            <span>Notifications</span>
            <div className="flex gap-2">
              <button
                className="text-xs px-2 py-1 bg-blue-700 hover:bg-blue-800 rounded text-white"
                onClick={async () => {
                  await fetch("/api/notifications/mark-all-read", {
                    method: "POST",
                  });
                  setNotifications((prev) =>
                    prev.map((n) => ({ ...n, read: true }))
                  );
                  setNotificationCount(0);
                }}
              >
                Mark all as read
              </button>
            </div>
          </div>
          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-800">
            {notifications.length === 0 ? (
              <li className="p-4 text-center text-gray-400 text-sm">
                No notifications
              </li>
            ) : (
              notifications.map((notif) => {
                // Icon & color by type
                let icon = null;
                let color = "";
                switch (notif.type) {
                  case "success":
                    icon = <span className="text-green-400">✔️</span>;
                    color = "border-green-700";
                    break;
                  case "error":
                    icon = <span className="text-red-400">❌</span>;
                    color = "border-red-700";
                    break;
                  case "warning":
                    icon = <span className="text-yellow-400">⚠️</span>;
                    color = "border-yellow-700";
                    break;
                  case "task":
                    icon = <span className="text-blue-400">📝</span>;
                    color = "border-blue-700";
                    break;
                  case "job":
                    icon = <span className="text-purple-400">💼</span>;
                    color = "border-purple-700";
                    break;
                  default:
                    icon = <span className="text-gray-400">🔔</span>;
                    color = "border-gray-700";
                }
                return (
                  <li
                    key={notif.id}
                    className={`p-3 text-sm flex justify-between items-start gap-2 border-l-4 ${color} ${
                      notif.read ? "text-gray-400" : "text-white bg-blue-950/30"
                    }`}
                  >
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-2">
                        {icon}
                        {notif.link ? (
                          <Link
                            href={notif.link}
                            className="underline hover:text-blue-400 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {notif.message}
                          </Link>
                        ) : (
                          <span>{notif.message}</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {!notif.read && (
                        <button
                          className="ml-2 px-2 py-1 text-xs rounded bg-blue-700 hover:bg-blue-800 text-white transition"
                          onClick={async () => {
                            await fetch("/api/notifications/mark-read", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                notificationId: notif.id,
                              }),
                            });
                            setNotifications((prev) =>
                              prev.map((n) =>
                                n.id === notif.id ? { ...n, read: true } : n
                              )
                            );
                            setNotificationCount((prev) =>
                              Math.max(0, prev - 1)
                            );
                          }}
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        className="ml-2 px-2 py-1 text-xs rounded bg-red-700 hover:bg-red-800 text-white transition"
                        onClick={async () => {
                          await fetch("/api/notifications/delete", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ notificationId: notif.id }),
                          });
                          setNotifications((prev) =>
                            prev.filter((n) => n.id !== notif.id)
                          );
                          if (!notif.read)
                            setNotificationCount((prev) =>
                              Math.max(0, prev - 1)
                            );
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
