"use client";
import React, { useState, useRef, useEffect } from "react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

const PomodoroTimer: React.FC = () => {
  const [workMinutes, setWorkMinutes] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pomodoroWorkMinutes");
      if (saved) return Number(saved);
    }
    return 25;
  });
  const [breakMinutes, setBreakMinutes] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pomodoroBreakMinutes");
      if (saved) return Number(saved);
    }
    return 5;
  });
  // Save custom durations to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pomodoroWorkMinutes", String(workMinutes));
    }
  }, [workMinutes]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pomodoroBreakMinutes", String(breakMinutes));
    }
  }, [breakMinutes]);
  // Sound notification
  const playSound = () => {
    // Try a short beep using Web Audio API for best compatibility
    try {
      const ctx = new (window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext!)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 880; // A5 note
      gain.gain.value = 0.2;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.4);
      oscillator.onended = () => ctx.close();
    } catch {
      // fallback: try another audio file
      const audio = new Audio(
        "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
      );
      audio.play();
    }
  };
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Desktop notification
  const showDesktopNotification = (msg: string) => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(msg);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            new Notification(msg);
          }
        });
      }
    }
  };

  const startTimer = () => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s > 0) return s - 1;
        setMinutes((m) => {
          if (m > 0) {
            setSeconds(59);
            return m - 1;
          } else {
            // Switch between work and break
            playSound();
            showDesktopNotification(isBreak ? "Back to work!" : "Break time!");
            if (!isBreak) {
              setIsBreak(true);
              setMinutes(breakMinutes);
              setSeconds(0);
            } else {
              setIsBreak(false);
              setMinutes(workMinutes);
              setSeconds(0);
            }
            setIsRunning(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
        });
        return 0;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsBreak(false);
    setMinutes(workMinutes);
    setSeconds(0);
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSettings(false);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsBreak(false);
    setMinutes(workMinutes);
    setSeconds(0);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <div className="flex w-full justify-between items-center mb-2">
        <div className="text-lg font-semibold text-cyan-400">
          {isBreak ? "Break Time" : "Work Time"}
        </div>
        <button
          className="text-xs px-2 py-1 bg-cyan-700 hover:bg-cyan-800 text-cyan-100 rounded transition ml-2"
          onClick={() => setShowSettings((v) => !v)}
        >
          Settings
        </button>
      </div>

      {showSettings && (
        <form
          onSubmit={handleSettingsSave}
          className="flex flex-col gap-3 bg-gray-900 border border-cyan-500/30 rounded-xl p-4 mb-2 w-full max-w-xs"
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm text-cyan-300">Work Minutes</label>
            <input
              type="number"
              min={1}
              max={120}
              value={workMinutes}
              onChange={(e) =>
                setWorkMinutes(
                  Math.max(1, Math.min(120, Number(e.target.value)))
                )
              }
              className="w-full px-2 py-1 rounded bg-gray-800 text-cyan-100 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-cyan-300">Break Minutes</label>
            <input
              type="number"
              min={1}
              max={60}
              value={breakMinutes}
              onChange={(e) =>
                setBreakMinutes(
                  Math.max(1, Math.min(60, Number(e.target.value)))
                )
              }
              className="w-full px-2 py-1 rounded bg-gray-800 text-cyan-100 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold shadow"
          >
            Save
          </button>
        </form>
      )}

      <div className="text-5xl font-mono font-bold text-cyan-400">
        {pad(minutes)}:{pad(seconds)}
      </div>
      <div className="flex gap-3 mt-2">
        {!isRunning ? (
          <button
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold shadow"
            onClick={startTimer}
          >
            {minutes === workMinutes && seconds === 0 && !isBreak
              ? "Start"
              : "Resume"}
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold shadow"
            onClick={pauseTimer}
          >
            Pause
          </button>
        )}
        <button
          className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-cyan-200 rounded-lg font-semibold shadow"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
      <div className="text-xs text-cyan-300 mt-2">
        {isBreak
          ? `Take a ${breakMinutes}-minute break!`
          : `Focus for ${workMinutes} minutes.`}
      </div>
    </div>
  );
};

export default PomodoroTimer;
