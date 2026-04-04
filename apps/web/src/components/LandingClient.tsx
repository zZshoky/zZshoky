"use client";

import { useState } from "react";
import type { Locale } from "@/lib/translations";
import { translations } from "@/lib/translations";
import LanguageToggle from "./LanguageToggle";
import WaitlistForm from "./WaitlistForm";

interface Props {
  initialCount:  number;
  initialLocale: Locale;
}

export default function LandingClient({ initialCount, initialLocale }: Props) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const t = translations[locale];

  return (
    <main>
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 hero-gradient border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Corpora PR</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-white/80 text-sm font-medium">
            <a href="#features"   className="hover:text-white transition-colors">{t.nav.features}</a>
            <a href="#how"        className="hover:text-white transition-colors">{t.nav.howItWorks}</a>
            <a href="#waitlist"   className="hover:text-white transition-colors">{t.nav.waitlist}</a>
          </div>
          <LanguageToggle locale={locale} onToggle={setLocale} />
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="hero-gradient min-h-screen flex items-center pt-16">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20
                           text-white/80 text-sm font-medium mb-6">
            {t.hero.badge}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            {t.hero.headline}
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10">
            {t.hero.sub}
          </p>
          <div className="flex flex-col items-center gap-3">
            <a
              href="#waitlist"
              className="px-8 py-4 bg-accent hover:bg-accent-light text-white font-bold
                         rounded-xl transition-colors text-lg shadow-lg"
            >
              {t.hero.cta}
            </a>
            <span className="text-white/50 text-sm">{t.hero.ctaSub}</span>
          </div>
        </div>
      </section>

      {/* ── Social Proof ───────────────────────────────────────────────── */}
      <section className="bg-surface border-b border-surface-dark py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-center">
            {initialCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">{initialCount}+</span>
                <span className="text-text-light text-sm">{t.stats.label}</span>
              </div>
            )}
            <div className="hidden md:block w-px h-8 bg-surface-dark" />
            <p className="text-text-light text-sm font-medium">{t.social.title}</p>
            <div className="flex flex-wrap gap-2">
              {t.social.items.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 bg-white border border-surface-dark rounded-full
                             text-text-light text-xs font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-text text-center mb-16">
            {t.features.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.features.cards.map((card) => (
              <div
                key={card.title}
                className="p-6 rounded-2xl border border-surface-dark card-hover bg-surface"
              >
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-lg font-bold text-text mb-2">{card.title}</h3>
                <p className="text-text-light text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────── */}
      <section id="how" className="py-24 bg-surface">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-text text-center mb-16">
            {t.howItWorks.title}
          </h2>
          <div className="space-y-10">
            {t.howItWorks.steps.map((step, i) => (
              <div key={step.step} className="flex gap-6 items-start">
                <div
                  className="flex-shrink-0 w-14 h-14 hero-gradient rounded-2xl
                               flex items-center justify-center text-white font-bold text-lg"
                >
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text mb-2">{step.title}</h3>
                  <p className="text-text-light leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Waitlist ───────────────────────────────────────────────────── */}
      <section id="waitlist" className="py-24 hero-gradient">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.waitlist.title}
          </h2>
          <p className="text-white/70 mb-10">{t.waitlist.sub}</p>
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <WaitlistForm t={t.waitlist} />
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-text py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">CP</span>
              </div>
              <span className="text-white font-bold">Corpora PR</span>
            </div>
            <p className="text-white/40 text-sm">{t.footer.tagline}</p>
            <div className="flex gap-6 text-white/40 text-sm">
              {t.footer.links.map(link => (
                <a key={link} href="#" className="hover:text-white/70 transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
