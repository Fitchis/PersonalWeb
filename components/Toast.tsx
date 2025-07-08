"use client";
import { useEffect, useState } from "react";

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
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);

    // Start exit animation before closing
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2000);

    // Close after exit animation
    const closeTimer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  const getIcon = () => {
    if (type === "success") {
      return (
        <svg
          className="w-5 h-5 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-5 h-5 text-red-400"
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
      );
    }
  };

  const getStyles = () => {
    const baseStyles =
      "fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl font-medium transition-all duration-300 backdrop-blur-xl border";

    if (type === "success") {
      return `${baseStyles} bg-gray-900/80 border-green-500/30 text-green-400`;
    } else {
      return `${baseStyles} bg-gray-900/80 border-red-500/30 text-red-400`;
    }
  };

  return (
    <div
      className={`${getStyles()} ${
        isVisible && !isExiting
          ? "transform translate-x-0 opacity-100 scale-100"
          : "transform translate-x-full opacity-0 scale-95"
      }`}
      role="alert"
    >
      <div className="flex items-center space-x-3">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            type === "success"
              ? "bg-green-500/20 border border-green-500/30"
              : "bg-red-500/20 border border-red-500/30"
          }`}
        >
          {getIcon()}
        </div>

        {/* Message */}
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{message}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center transition-colors duration-200 group"
        >
          <svg
            className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors duration-200"
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

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800/50 rounded-b-xl overflow-hidden">
        <div
          className={`h-full ${
            type === "success" ? "bg-green-500" : "bg-red-500"
          } transition-all duration-2000 ease-linear ${
            isVisible && !isExiting ? "w-0" : "w-full"
          }`}
          style={{
            animation:
              isVisible && !isExiting ? "progress 2s linear forwards" : "none",
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
