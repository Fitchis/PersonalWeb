"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Check,
  X,
  CheckCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ClipboardList,
  Briefcase,
  Info,
} from "lucide-react";
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

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-emerald-400 w-5 h-5" />;
      case "error":
        return <XCircle className="text-red-400 w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="text-amber-400 w-5 h-5" />;
      case "task":
        return <ClipboardList className="text-blue-400 w-5 h-5" />;
      case "job":
        return <Briefcase className="text-purple-400 w-5 h-5" />;
      case "custom":
        return <Bell className="text-gray-400 w-5 h-5" />;
      case "info":
      default:
        return <Info className="text-sky-400 w-5 h-5" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-800/50 rounded-lg"
        onClick={() => setShowDropdown((v) => !v)}
        aria-label="Show notifications"
      >
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-[10px] font-medium text-white shadow-lg">
            {notificationCount > 99 ? "99+" : notificationCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-3 border-b border-gray-800/50 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-200">
              Notifications
            </h3>
            {notifications.some((n) => !n.read) && (
              <button
                className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors duration-200 flex items-center gap-1"
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
                <CheckCheck className="h-3 w-3" />
                Mark all
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No notifications
              </div>
            ) : (
              notifications.map((notif) => {
                return (
                  <div
                    key={notif.id}
                    className={`relative p-3 border-b border-gray-800/30 last:border-b-0 transition-all duration-200 hover:bg-gray-800/30 ${
                      !notif.read
                        ? "bg-blue-500/5 border-l-2 border-l-blue-500"
                        : ""
                    }`}
                  >
                    {/* Unread indicator */}
                    {!notif.read && (
                      <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    )}

                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center">
                        {getNotificationIcon(notif.type || "info")}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            {notif.link ? (
                              <Link
                                href={notif.link}
                                className="text-sm text-gray-200 hover:text-blue-400 transition-colors block truncate"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {notif.message}
                              </Link>
                            ) : (
                              <p className="text-sm text-gray-200 truncate">
                                {notif.message}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatTimeAgo(notif.createdAt)}
                            </p>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-1 ml-2">
                            {!notif.read && (
                              <button
                                className="p-1 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded transition-all duration-200"
                                onClick={async () => {
                                  await fetch("/api/notifications/mark-read", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      notificationId: notif.id,
                                    }),
                                  });
                                  setNotifications((prev) =>
                                    prev.map((n) =>
                                      n.id === notif.id
                                        ? { ...n, read: true }
                                        : n
                                    )
                                  );
                                  setNotificationCount((prev) =>
                                    Math.max(0, prev - 1)
                                  );
                                }}
                                title="Mark as read"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-all duration-200"
                              onClick={async () => {
                                await fetch("/api/notifications/delete", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    notificationId: notif.id,
                                  }),
                                });
                                setNotifications((prev) =>
                                  prev.filter((n) => n.id !== notif.id)
                                );
                                if (!notif.read)
                                  setNotificationCount((prev) =>
                                    Math.max(0, prev - 1)
                                  );
                              }}
                              title="Delete"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
