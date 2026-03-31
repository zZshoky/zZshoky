"use client";

import { useEffect, useState } from "react";
import {
  getDonations,
  addDonation,
  removeDonation,
  getDonationTotal,
  type Donation,
} from "@/lib/store";

export default function DonationsPage() {
  const currentYear = new Date().getFullYear();
  const requirement = 10000;
  const [donations, setDonations] = useState<Donation[]>([]);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    organization: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    setDonations(getDonations());
    setTotal(getDonationTotal(currentYear));
  }, [currentYear]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const updated = addDonation({
      organization: form.organization,
      amount: parseFloat(form.amount),
      date: form.date,
      notes: form.notes,
      receiptUploaded: false,
    });
    setDonations(updated);
    setTotal(getDonationTotal(currentYear));
    setForm({
      organization: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setShowForm(false);
  }

  function handleRemove(id: string) {
    const updated = removeDonation(id);
    setDonations(updated);
    setTotal(getDonationTotal(currentYear));
  }

  const remaining = Math.max(requirement - total, 0);
  const percentage = Math.min((total / requirement) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Charitable Donations</h1>
          <p className="text-text-light">
            Track contributions to Puerto Rico nonprofits
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors text-sm"
        >
          {showForm ? "Cancel" : "+ Add Donation"}
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-text-light">Annual Progress</p>
            <p className="text-3xl font-bold text-text">
              ${total.toLocaleString()}
              <span className="text-lg text-text-light font-normal">
                {" "}/ ${requirement.toLocaleString()}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-light">Remaining</p>
            <p className={`text-2xl font-bold ${remaining === 0 ? "text-success" : "text-warning"}`}>
              ${remaining.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: percentage >= 100 ? "#06D6A0" : "#FFD166",
            }}
          />
        </div>
        {percentage >= 100 && (
          <p className="text-sm text-success font-medium mt-2">
            You&apos;ve met your annual donation requirement!
          </p>
        )}
      </div>

      {/* Add Form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4"
        >
          <h2 className="font-semibold text-text">Record a Donation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Organization
              </label>
              <input
                type="text"
                required
                value={form.organization}
                onChange={(e) =>
                  setForm({ ...form, organization: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. Fundacion Comunitaria de PR"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Amount (USD)
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Notes (optional)
              </label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Tax-deductible donation"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors text-sm"
          >
            Save Donation
          </button>
        </form>
      )}

      {/* Donations List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-text">
            Donation History ({currentYear})
          </h2>
        </div>
        {donations.length === 0 ? (
          <div className="p-8 text-center text-text-light">
            <p className="text-4xl mb-2">💝</p>
            <p>No donations recorded yet.</p>
            <p className="text-sm">
              Click &quot;Add Donation&quot; to start tracking.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {donations
              .filter((d) => d.date.startsWith(String(currentYear)))
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((donation) => (
                <div
                  key={donation.id}
                  className="p-4 flex items-center gap-4 hover:bg-gray-50"
                >
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <span className="text-lg">💝</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text text-sm">
                      {donation.organization}
                    </p>
                    <p className="text-xs text-text-light">
                      {new Date(donation.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {donation.notes && ` — ${donation.notes}`}
                    </p>
                  </div>
                  <span className="font-semibold text-text">
                    ${donation.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleRemove(donation.id)}
                    className="p-2 text-text-light hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
        <h3 className="font-semibold text-primary mb-2">
          Approved Organizations
        </h3>
        <p className="text-sm text-text-light leading-relaxed">
          Donations must be made to IRS-recognized 501(c)(3) nonprofits
          registered in Puerto Rico. Common choices include Fundacion
          Comunitaria de Puerto Rico, Boys &amp; Girls Clubs of PR, and local
          university scholarships. Keep all receipts — they are required for
          annual compliance audits.
        </p>
      </div>
    </div>
  );
}
