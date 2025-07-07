import React from "react";

function getMonthDays(year: number, month: number) {
  // month: 0-based
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

function getToday() {
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
}

export default function MiniCalendarWidget() {
  const today = getToday();
  const days = getMonthDays(today.y, today.m);
  const firstDayOfWeek = new Date(today.y, today.m, 1).getDay();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-xl p-3 shadow-lg border border-gray-700 w-full h-full flex flex-col justify-between text-sm max-w-xs min-w-[180px] min-h-[220px]">
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-xl text-cyan-400 tracking-wide">
            {new Date(today.y, today.m).toLocaleString("default", {
              month: "long",
            })}{" "}
            {today.y}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs text-cyan-300 mb-2">
          {weekDays.map((wd) => (
            <div
              key={wd}
              className="text-center font-semibold uppercase tracking-wide"
            >
              {wd}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {/* Empty slots for first week */}
          {Array(firstDayOfWeek)
            .fill(null)
            .map((_, i) => (
              <div key={"empty-" + i}></div>
            ))}
          {/* Days */}
          {days.map((date) => {
            const isToday = date.getDate() === today.d;
            return (
              <div
                key={date.getDate()}
                className={`text-center rounded-lg aspect-square flex items-center justify-center transition-all duration-150 cursor-pointer select-none
                  ${
                    isToday
                      ? "bg-cyan-500 text-white font-bold shadow-lg scale-105 border-2 border-cyan-300"
                      : "text-gray-200 hover:bg-gray-600 hover:text-cyan-200"
                  }
                `}
                style={{ minHeight: 32 }}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
