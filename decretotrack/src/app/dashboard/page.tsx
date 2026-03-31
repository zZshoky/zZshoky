"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPresenceCount, getDonationTotal, getDeadlines } from "@/lib/store";

function ComplianceScore({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "#06D6A0" : score >= 50 ? "#FFD166" : "#EF476F";

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#E2E8F0"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-text">{score}%</span>
        <span className="text-xs text-text-light">Compliant</span>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const [presenceCount, setPresenceCount] = useState(0);
  const [donationTotal, setDonationTotal] = useState(0);
  const [deadlines, setDeadlines] = useState<ReturnType<typeof getDeadlines>>([]);
  const currentYear = new Date().getFullYear();
  const donationRequirement = 10000;

  useEffect(() => {
    setPresenceCount(getPresenceCount(currentYear));
    setDonationTotal(getDonationTotal(currentYear));
    setDeadlines(getDeadlines());
  }, [currentYear]);

  const dayOfYear = Math.floor(
    (Date.now() - new Date(currentYear, 0, 1).getTime()) / 86400000
  );
  const projectedDays = Math.round((presenceCount / Math.max(dayOfYear, 1)) * 365);

  // Calculate compliance score
  const presenceScore = Math.min((presenceCount / 183) * 100, 100);
  const donationScore = Math.min((donationTotal / donationRequirement) * 100, 100);
  const deadlineScore =
    deadlines.length > 0
      ? (deadlines.filter((d) => d.completed).length / deadlines.length) * 100
      : 0;
  const overallScore = Math.round(
    presenceScore * 0.5 + donationScore * 0.3 + deadlineScore * 0.2
  );

  const upcomingDeadlines = deadlines
    .filter((d) => !d.completed && new Date(d.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <p className="text-text-light">
          Your Act 60 compliance overview for {currentYear}
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text-light">
              Days in PR
            </span>
            <span className="text-2xl">📅</span>
          </div>
          <div className="text-3xl font-bold text-text">
            {presenceCount}
            <span className="text-lg text-text-light font-normal">/183</span>
          </div>
          <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${Math.min((presenceCount / 183) * 100, 100)}%`,
                backgroundColor:
                  presenceCount >= 183 ? "#06D6A0" : "#3282B8",
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text-light">
              Projected Days
            </span>
            <span className="text-2xl">📈</span>
          </div>
          <div className="text-3xl font-bold text-text">
            {projectedDays}
            <span className="text-lg text-text-light font-normal"> days</span>
          </div>
          <p
            className={`text-sm mt-2 font-medium ${
              projectedDays >= 183 ? "text-success" : "text-danger"
            }`}
          >
            {projectedDays >= 183
              ? "On track to meet requirement"
              : `Need ${183 - presenceCount} more days`}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text-light">
              Donations
            </span>
            <span className="text-2xl">💝</span>
          </div>
          <div className="text-3xl font-bold text-text">
            ${donationTotal.toLocaleString()}
          </div>
          <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${Math.min((donationTotal / donationRequirement) * 100, 100)}%`,
                backgroundColor:
                  donationTotal >= donationRequirement
                    ? "#06D6A0"
                    : "#FFD166",
              }}
            />
          </div>
          <p className="text-xs text-text-light mt-1">
            ${(donationRequirement - donationTotal).toLocaleString()} remaining
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text-light">
              Deadlines
            </span>
            <span className="text-2xl">🔔</span>
          </div>
          <div className="text-3xl font-bold text-text">
            {deadlines.filter((d) => d.completed).length}
            <span className="text-lg text-text-light font-normal">
              /{deadlines.length}
            </span>
          </div>
          <p className="text-sm text-text-light mt-2">
            {deadlines.filter((d) => !d.completed).length} remaining this year
          </p>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Score */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-text mb-4 self-start">
            Compliance Score
          </h2>
          <ComplianceScore score={overallScore} />
          <div className="mt-4 w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-light">Presence</span>
              <span className="font-medium text-text">
                {Math.round(presenceScore)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-light">Donations</span>
              <span className="font-medium text-text">
                {Math.round(donationScore)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-light">Filings</span>
              <span className="font-medium text-text">
                {Math.round(deadlineScore)}%
              </span>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">
              Upcoming Deadlines
            </h2>
            <Link
              href="/dashboard/deadlines"
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              View all →
            </Link>
          </div>
          {upcomingDeadlines.length === 0 ? (
            <p className="text-text-light text-sm">
              All caught up! No upcoming deadlines.
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((dl) => {
                const daysUntil = Math.ceil(
                  (new Date(dl.date).getTime() - Date.now()) / 86400000
                );
                return (
                  <div
                    key={dl.id}
                    className="flex items-center gap-4 p-4 bg-surface rounded-xl"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                        daysUntil <= 7
                          ? "bg-danger"
                          : daysUntil <= 30
                          ? "bg-warning"
                          : "bg-primary-light"
                      }`}
                    >
                      {daysUntil}d
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text text-sm">
                        {dl.title}
                      </p>
                      <p className="text-xs text-text-light">
                        {dl.description}
                      </p>
                    </div>
                    <span className="text-xs text-text-light">
                      {new Date(dl.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
