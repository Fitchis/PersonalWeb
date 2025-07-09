"use client";
import React from "react";

interface WidgetSettingsPanelProps {
  show: boolean;
  onClose: () => void;
  widgetPrefs: {
    quote: boolean;
    calendar: boolean;
    music: boolean;
    pomodoro: boolean;
  };
  setWidgetPrefs: React.Dispatch<
    React.SetStateAction<{
      quote: boolean;
      calendar: boolean;
      music: boolean;
      pomodoro: boolean;
    }>
  >;
}

const widgetOptions = [
  { key: "quote", icon: "💭", label: "Quote" },
  { key: "calendar", icon: "📅", label: "Calendar" },
  { key: "music", icon: "🎵", label: "Music" },
  { key: "pomodoro", icon: "⏲️", label: "Timer" },
];

const WidgetSettingsPanel: React.FC<WidgetSettingsPanelProps> = ({
  show,
  onClose,
  widgetPrefs,
  setWidgetPrefs,
}) => {
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!show || !hasMounted) return null;
  return (
    <div className="mb-6 bg-gray-800/50 border border-gray-700 rounded-lg p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-300">
          Toggle Widgets
        </span>
        <button
          className="text-gray-400 hover:text-gray-200 transition-colors"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {widgetOptions.map(({ key, icon, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={widgetPrefs[key as keyof typeof widgetPrefs]}
              onChange={(e) =>
                setWidgetPrefs((p) => ({ ...p, [key]: e.target.checked }))
              }
              className="w-4 h-4 text-indigo-500 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-1"
            />
            <span className="text-sm text-gray-300 flex items-center gap-1">
              <span className="text-xs">{icon}</span>
              {label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default WidgetSettingsPanel;
