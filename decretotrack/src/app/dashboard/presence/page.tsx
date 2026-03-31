"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getPresenceDays,
  togglePresenceDay,
  getPresenceCount,
  type PresenceDay,
} from "@/lib/store";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PresenceTracker() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [viewMonth, setViewMonth] = useState(currentMonth);
  const [viewYear, setViewYear] = useState(currentYear);
  const [presenceDays, setPresenceDays] = useState<PresenceDay[]>([]);
  const [yearCount, setYearCount] = useState(0);

  useEffect(() => {
    setPresenceDays(getPresenceDays());
    setYearCount(getPresenceCount(currentYear));
  }, [currentYear]);

  const handleToggle = useCallback(
    (dateStr: string) => {
      const updated = togglePresenceDay(dateStr);
      setPresenceDays(updated);
      setYearCount(getPresenceCount(currentYear));
    },
    [currentYear]
  );

  const isPresent = (dateStr: string) =>
    presenceDays.some((d) => d.date === dateStr && d.present);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
  const todayStr = new Date().toISOString().split("T")[0];

  const daysRemaining = 365 - Math.floor(
    (Date.now() - new Date(currentYear, 0, 1).getTime()) / 86400000
  );
  const daysNeeded = Math.max(183 - yearCount, 0);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  // Monthly count for the viewed month
  const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;
  const monthCount = presenceDays.filter(
    (d) => d.date.startsWith(monthPrefix) && d.present
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Presence Tracker</h1>
        <p className="text-text-light">
          Track your physical presence in Puerto Rico
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
          <div className="text-3xl font-bold text-primary">{yearCount}</div>
          <div className="text-xs text-text-light mt-1">Days in PR ({currentYear})</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
          <div className={`text-3xl font-bold ${daysNeeded === 0 ? "text-success" : "text-danger"}`}>
            {daysNeeded}
          </div>
          <div className="text-xs text-text-light mt-1">Days Still Needed</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
          <div className="text-3xl font-bold text-text">{daysRemaining}</div>
          <div className="text-xs text-text-light mt-1">Days Left in Year</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
          <div className="text-3xl font-bold text-accent">{monthCount}</div>
          <div className="text-xs text-text-light mt-1">
            Days This Month
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-text">
            {MONTHS[viewMonth]} {viewYear}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-text-light py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the 1st */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const present = isPresent(dateStr);
            const isToday = dateStr === todayStr;
            const isFuture = new Date(dateStr) > new Date();

            return (
              <button
                key={dateStr}
                onClick={() => !isFuture && handleToggle(dateStr)}
                disabled={isFuture}
                className={`calendar-day aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                  present
                    ? "bg-success text-white shadow-sm"
                    : isFuture
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-text hover:bg-gray-100"
                } ${isToday ? "ring-2 ring-accent ring-offset-2" : ""}`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success" />
            <span className="text-xs text-text-light">Present in PR</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100" />
            <span className="text-xs text-text-light">Not logged</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded ring-2 ring-accent" />
            <span className="text-xs text-text-light">Today</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
        <h3 className="font-semibold text-primary mb-2">
          Pro Tip: Presence Day Tracking
        </h3>
        <p className="text-sm text-text-light leading-relaxed">
          A &quot;presence day&quot; counts as any day where you are physically in Puerto
          Rico at any point during the day. Travel days count as long as you
          sleep in PR that night. Keep boarding passes and travel records as
          backup documentation.
        </p>
      </div>
    </div>
  );
}
