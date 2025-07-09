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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-slate-100">
          Send Notification
        </h2>
        <textarea
          className="w-full h-32 p-3 rounded-xl bg-slate-800 text-slate-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Enter your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-xl bg-slate-700 text-slate-200 hover:bg-slate-600"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-60"
            onClick={() => onSend(message)}
            disabled={loading || !message.trim()}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
