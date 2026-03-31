"use client";

import { useEffect, useState } from "react";
import { getDeadlines, toggleDeadline, type Deadline } from "@/lib/store";

const categoryColors: Record<string, string> = {
  filing: "bg-primary/10 text-primary",
  donation: "bg-warning/10 text-warning",
  employment: "bg-accent/10 text-accent",
  other: "bg-gray-100 text-text-light",
};

const categoryLabels: Record<string, string> = {
  filing: "Filing",
  donation: "Donation",
  employment: "Employment",
  other: "Other",
};

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);

  useEffect(() => {
    setDeadlines(getDeadlines());
  }, []);

  function handleToggle(id: string) {
    const updated = toggleDeadline(id);
    setDeadlines(updated);
  }

  const upcoming = deadlines
    .filter((d) => !d.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const completed = deadlines.filter((d) => d.completed);

  function getDaysUntil(dateStr: string) {
    return Math.ceil(
      (new Date(dateStr).getTime() - Date.now()) / 86400000
    );
  }

  function getUrgency(dateStr: string) {
    const days = getDaysUntil(dateStr);
    if (days < 0) return "overdue";
    if (days <= 7) return "urgent";
    if (days <= 30) return "soon";
    return "normal";
  }

  const urgencyStyles = {
    overdue: "border-l-4 border-l-danger bg-danger/5",
    urgent: "border-l-4 border-l-danger",
    soon: "border-l-4 border-l-warning",
    normal: "border-l-4 border-l-primary-light",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Filing Deadlines</h1>
        <p className="text-text-light">
          Stay on top of your compliance calendar
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
          <div className="text-3xl font-bold text-danger">
            {upcoming.filter((d) => getDaysUntil(d.date) <= 30).length}
          </div>
          <div className="text-xs text-text-light mt-1">Due Within 30 Days</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
          <div className="text-3xl font-bold text-text">{upcoming.length}</div>
          <div className="text-xs text-text-light mt-1">Pending</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
          <div className="text-3xl font-bold text-success">
            {completed.length}
          </div>
          <div className="text-xs text-text-light mt-1">Completed</div>
        </div>
      </div>

      {/* Upcoming */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-text-light">
            All deadlines completed! Great job staying compliant.
          </div>
        ) : (
          upcoming.map((dl) => {
            const urgency = getUrgency(dl.date);
            const days = getDaysUntil(dl.date);
            return (
              <div
                key={dl.id}
                className={`bg-white rounded-xl p-5 border border-gray-100 ${urgencyStyles[urgency]} flex items-center gap-4`}
              >
                <button
                  onClick={() => handleToggle(dl.id)}
                  className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-success hover:bg-success/10 flex-shrink-0 transition-colors"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-text">{dl.title}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        categoryColors[dl.category]
                      }`}
                    >
                      {categoryLabels[dl.category]}
                    </span>
                  </div>
                  <p className="text-sm text-text-light">{dl.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium text-text">
                    {new Date(dl.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      days < 0
                        ? "text-danger"
                        : days <= 7
                        ? "text-danger"
                        : days <= 30
                        ? "text-warning"
                        : "text-text-light"
                    }`}
                  >
                    {days < 0
                      ? `${Math.abs(days)} days overdue`
                      : days === 0
                      ? "Due today"
                      : `${days} days left`}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-text">Completed</h2>
          {completed.map((dl) => (
            <div
              key={dl.id}
              className="bg-white rounded-xl p-5 border border-gray-100 flex items-center gap-4 opacity-60"
            >
              <button
                onClick={() => handleToggle(dl.id)}
                className="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0"
              >
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
              <div className="flex-1">
                <p className="font-medium text-text line-through">
                  {dl.title}
                </p>
                <p className="text-sm text-text-light">{dl.description}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  categoryColors[dl.category]
                }`}
              >
                {categoryLabels[dl.category]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
