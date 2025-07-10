import React, { useState, useEffect } from "react";

interface HowToUsePopupProps {
  localStorageKey?: string;
}

const HOW_TO_USE_KEY = "howToUsePopupDismissed";

const HowToUsePopup: React.FC<HowToUsePopupProps> = ({
  localStorageKey = HOW_TO_USE_KEY,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setVisible(localStorage.getItem(localStorageKey) !== "true");
    }
  }, [localStorageKey]);

  const handleClose = () => {
    setVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(localStorageKey, "true");
    }
  };

  const handleShow = () => {
    setVisible(true);
    if (typeof window !== "undefined") {
      localStorage.removeItem(localStorageKey);
    }
  };

  return (
    <>
      {/* Floating Popup Widget */}
      {visible && (
        <div className="fixed bottom-8 left-8 z-50 bg-white dark:bg-gray-900 border border-blue-200 dark:border-gray-700 rounded-xl shadow-xl p-4 w-80 max-w-xs animate-fade-in">
          <div className="flex items-start justify-between mb-1">
            <div className="font-bold text-blue-700 dark:text-blue-300 text-base flex items-center gap-2">
              <span className="text-lg">❓</span> Quick Start
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-xl leading-none ml-2"
              aria-label="Close guide"
            >
              ×
            </button>
          </div>
          <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1 pl-1">
            <li>
              • Use <b>Settings</b> to customize widgets
            </li>
            <li>
              • Add tasks in <b>Todo List</b> (sign in required)
            </li>
            <li>
              • Track jobs in <b>Job Applications</b> (sign in required)
            </li>
            <li>
              • Click chat icon for <b>AI help</b>
            </li>
            <li>• View stats and use navbar to navigate</li>
          </ul>
        </div>
      )}
      {/* Floating Button to Show Popup Again */}
      {!visible && (
        <button
          onClick={handleShow}
          className="fixed bottom-8 left-8 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-colors"
          style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.18)" }}
        >
          <span className="text-lg">❓</span>
          <span className="font-semibold text-sm">Quick Start</span>
        </button>
      )}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default HowToUsePopup;
