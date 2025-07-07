"use client";
import { useEffect } from "react";

export interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-semibold transition-all duration-300
        ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
      role="alert"
    >
      {message}
    </div>
  );
}
