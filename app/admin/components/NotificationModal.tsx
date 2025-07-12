"use client";
import React, { useState } from "react";

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (msg: string) => void;
  loading: boolean;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  open,
  onClose,
  onSend,
  loading,
}) => {
  const [message, setMessage] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-slate-700/50 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Send Notification
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors duration-200"
            disabled={loading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="relative mb-6">
          <textarea
            className="w-full h-36 p-4 rounded-2xl bg-slate-800/50 text-slate-100 border border-slate-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 placeholder-slate-400 resize-none backdrop-blur-sm"
            placeholder="What would you like to share?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-400">
            {message.length}/500
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-6 py-3 rounded-xl bg-slate-700/50 text-slate-200 hover:bg-slate-600/50 transition-all duration-200 font-medium border border-slate-600/30 hover:border-slate-500/50"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            onClick={() => onSend(message)}
            disabled={loading || !message.trim()}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </div>
            ) : (
              "Send Notification"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
