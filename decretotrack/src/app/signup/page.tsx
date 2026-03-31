"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    decreeType: "act60",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center">
              <span className="text-white font-bold">DT</span>
            </div>
            <span className="font-bold text-2xl text-text">
              Decreto<span className="text-primary">Track</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-text">Start your free trial</h1>
          <p className="text-text-light mt-2">
            14 days free. No credit card required.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Decree Type
            </label>
            <select
              value={form.decreeType}
              onChange={(e) => setForm({ ...form, decreeType: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
            >
              <option value="act60">Act 60 — Individual Investor</option>
              <option value="act20">Act 60 — Export Services (formerly Act 20)</option>
              <option value="act22">Act 60 — Individual Investor (formerly Act 22)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Create Account
          </button>

          <p className="text-xs text-text-light text-center">
            By creating an account you agree to our{" "}
            <a href="#" className="text-primary">Terms of Service</a> and{" "}
            <a href="#" className="text-primary">Privacy Policy</a>.
          </p>
        </form>

        <p className="text-center text-sm text-text-light mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:text-primary-dark"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
