"use client";
import React from "react";
import MotivationalQuoteWidget from "./MotivationalQuoteWidget";
import MiniCalendarWidget from "./MiniCalendarWidget";
import PomodoroTimer from "./PomodoroTimer";
import { RequireAuth } from "../RequireAuth";
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
  <RequireAuth
    preview={
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-3 min-h-[120px] flex flex-col items-center justify-center animate-pulse">
            <div className="w-10 h-10 bg-purple-700/30 rounded-full mb-2" />
            <div className="w-2/3 h-4 bg-gray-700/40 rounded mb-1" />
            <div className="w-1/2 h-3 bg-gray-700/30 rounded" />
          </div>
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-3 min-h-[120px] flex flex-col items-center justify-center animate-pulse">
            <div className="w-10 h-10 bg-blue-700/30 rounded-full mb-2" />
            <div className="w-2/3 h-4 bg-gray-700/40 rounded mb-1" />
            <div className="w-1/2 h-3 bg-gray-700/30 rounded" />
          </div>
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-3 min-h-[120px] flex flex-col items-center justify-center animate-pulse">
            <div className="w-10 h-10 bg-green-700/30 rounded-full mb-2" />
            <div className="w-2/3 h-4 bg-gray-700/40 rounded mb-1" />
            <div className="w-1/2 h-3 bg-gray-700/30 rounded" />
          </div>
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-3 min-h-[120px] flex flex-col items-center justify-center animate-pulse">
            <div className="w-10 h-10 bg-pink-700/30 rounded-full mb-2" />
            <div className="w-2/3 h-4 bg-gray-700/40 rounded mb-1" />
            <div className="w-1/2 h-3 bg-gray-700/30 rounded" />
          </div>
        </div>
        <div className="text-gray-400 text-center text-sm">
          Please log in to access your personalized dashboard widgets.
          <br />
          <span className="italic text-gray-500">
            (Feature preview: motivational quotes, calendar, music player,
            pomodoro timer)
          </span>
        </div>
      </div>
    }
  >
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
  </RequireAuth>
);

export default DashboardWidgets;
