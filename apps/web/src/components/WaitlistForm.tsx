"use client";

import { useState, FormEvent } from "react";
import type { Translations } from "@/lib/translations";
import { joinWaitlist } from "@/lib/api";

type FormState = "idle" | "loading" | "success" | "duplicate" | "error";

interface Props {
  t: Translations["waitlist"];
}

export default function WaitlistForm({ t }: Props) {
  const [email,    setEmail]    = useState("");
  const [name,     setName]     = useState("");
  const [orgType,  setOrgType]  = useState("contractor");
  const [state,    setState]    = useState<FormState>("idle");
  const [position, setPosition] = useState<number | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const result = await joinWaitlist({
        email,
        org_type: orgType,
        name: name || undefined,
      });
      setPosition(result.position);
      setState("success");
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "duplicate") {
        setState("duplicate");
      } else {
        setState("error");
      }
    }
  }

  if (state === "success" && position !== null) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-lg font-semibold text-text">{t.successMsg(position)}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder={t.namePlaceholder}
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200
                   focus:outline-none focus:ring-2 focus:ring-primary/30 text-text"
      />
      <input
        type="email"
        required
        placeholder={t.emailPlaceholder}
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200
                   focus:outline-none focus:ring-2 focus:ring-primary/30 text-text"
      />
      <select
        value={orgType}
        onChange={e => setOrgType(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200
                   focus:outline-none focus:ring-2 focus:ring-primary/30 text-text bg-white"
      >
        {(Object.entries(t.orgTypes) as [string, string][]).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      {state === "duplicate" && (
        <p className="text-sm text-red-500">{t.errorDup}</p>
      )}
      {state === "error" && (
        <p className="text-sm text-red-500">{t.errorGeneric}</p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full py-3 px-6 bg-primary text-white font-semibold rounded-xl
                   hover:bg-primary-dark transition-colors disabled:opacity-60"
      >
        {state === "loading" ? t.submitting : t.submitBtn}
      </button>
    </form>
  );
}
