"use client";
import React from "react";
import MotivationalQuoteWidget from "./MotivationalQuoteWidget";
import MiniCalendarWidget from "./MiniCalendarWidget";
import PomodoroTimer from "./PomodoroTimer";
const MusicPlayer = React.lazy(() => import("./MusicPlayer"));

interface DashboardWidgetsProps {
  widgetPrefs: {
    quote: boolean;
    calendar: boolean;
    music: boolean;
    pomodoro: boolean;
  };
}

const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ widgetPrefs }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
    {widgetPrefs.quote && (
      <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-3 hover:bg-gray-800/60 hover:border-purple-500/50 transition-all duration-300 min-h-[120px]">
        <MotivationalQuoteWidget />
      </div>
    )}
    {widgetPrefs.calendar && (
      <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-3 hover:bg-gray-800/60 hover:border-blue-500/50 transition-all duration-300 min-h-[120px]">
        <MiniCalendarWidget />
      </div>
    )}
    {widgetPrefs.music && (
      <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-3 hover:bg-gray-800/60 hover:border-green-500/50 transition-all duration-300 min-h-[120px]">
        <React.Suspense fallback={<div>Loading...</div>}>
          <MusicPlayer />
        </React.Suspense>
      </div>
    )}
    {widgetPrefs.pomodoro && (
      <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-3 hover:bg-gray-800/60 hover:border-pink-500/50 transition-all duration-300 min-h-[120px]">
        <PomodoroTimer />
      </div>
    )}
  </div>
);

export default DashboardWidgets;
