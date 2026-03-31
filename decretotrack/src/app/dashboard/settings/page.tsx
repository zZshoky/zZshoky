"use client";

import { useEffect, useState } from "react";
import { getProfile, saveProfile, type UserProfile } from "@/lib/store";

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    decreeType: "act60",
    decreeNumber: "",
    yearStarted: new Date().getFullYear(),
    annualDonationRequirement: 10000,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = getProfile();
    if (existing) setProfile(existing);
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <p className="text-text-light">
          Configure your decree profile and preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
          <h2 className="font-semibold text-text">Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Decree Info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
          <h2 className="font-semibold text-text">Decree Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Decree Type
              </label>
              <select
                value={profile.decreeType}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    decreeType: e.target.value as UserProfile["decreeType"],
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
              >
                <option value="act60">Act 60 — Individual Investor</option>
                <option value="act20">
                  Act 60 — Export Services (formerly Act 20)
                </option>
                <option value="act22">
                  Act 60 — Individual (formerly Act 22)
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Decree Number
              </label>
              <input
                type="text"
                value={profile.decreeNumber}
                onChange={(e) =>
                  setProfile({ ...profile, decreeNumber: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. 2024-12345"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Year Decree Granted
              </label>
              <input
                type="number"
                min="2012"
                max="2030"
                value={profile.yearStarted}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    yearStarted: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Annual Donation Requirement ($)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={profile.annualDonationRequirement}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    annualDonationRequirement: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
          <h2 className="font-semibold text-text">Notifications</h2>
          <div className="space-y-3">
            {[
              { label: "Email deadline reminders (7 days before)", defaultChecked: true },
              { label: "Weekly presence day summary", defaultChecked: true },
              { label: "Monthly compliance report", defaultChecked: false },
              { label: "Donation milestone alerts", defaultChecked: true },
            ].map((item) => (
              <label
                key={item.label}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-text">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors"
          >
            Save Changes
          </button>
          {saved && (
            <span className="text-sm text-success font-medium">
              Settings saved successfully!
            </span>
          )}
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl p-6 border border-danger/20 space-y-4">
        <h2 className="font-semibold text-danger">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text">Export All Data</p>
            <p className="text-xs text-text-light">
              Download all your compliance data as JSON
            </p>
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-text hover:bg-gray-50 transition-colors">
            Export
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text">Delete Account</p>
            <p className="text-xs text-text-light">
              Permanently delete your account and all data
            </p>
          </div>
          <button className="px-4 py-2 border border-danger/30 rounded-xl text-sm font-medium text-danger hover:bg-danger/5 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
