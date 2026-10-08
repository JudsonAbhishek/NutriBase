"use client";

import React from "react";
import Link from "next/link";
import { Apple, Database, ShieldAlert, Sparkles, Send, Mail } from "lucide-react";
import { FOOD_CATEGORIES } from "@/data/categories";

export function Footer() {
  const handleFeedbackSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const type = String(formData.get("type") || "Suggestion");
    const message = String(formData.get("message") || "").trim();
    const contact = String(formData.get("contact") || "").trim();

    if (!message) return;

    const subject = `NutriBase ${type}`;
    const body = [
      `Type: ${type}`,
      "",
      message,
      "",
      contact ? `Preferred contact: ${contact}` : "Preferred contact: Not provided",
      "",
      "Sent from the NutriBase website.",
    ].join("\n");

    window.location.href = `mailto:hello@nutribase.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    event.currentTarget.reset();
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-14 pb-20 lg:pb-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-3.5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Apple className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Nutri<span className="text-emerald-400">Base</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Precision Food & Nutrition Intelligence Platform. Discover, analyze, compare, and personalize your dietary choices with verified USDA FoodData Central and ICMR datasets.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 max-w-sm">
              <Database className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Backed by USDA FoodData Central & ICMR-NIN Indian Food Composition Tables.</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-200 mb-3.5">
              Food Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {FOOD_CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link href={`/search?category=${c.slug}`} className="hover:text-emerald-400 transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/search" className="text-emerald-400 font-bold hover:underline">
                  All Categories &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Calculators & Features */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-200 mb-3.5">
              Intelligence Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/discover" className="hover:text-emerald-400 transition-colors font-bold text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Find Foods For Me
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-emerald-400 transition-colors">
                  Food Comparison
                </Link>
              </li>
              <li>
                <Link href="/calculators/bmi" className="hover:text-emerald-400 transition-colors">
                  BMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/calories" className="hover:text-emerald-400 transition-colors">
                  Daily Calorie Needs
                </Link>
              </li>
              <li>
                <Link href="/calculators/macros" className="hover:text-emerald-400 transition-colors">
                  Macro Split Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Rankings */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-200 mb-3.5">
              Top Rankings
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/rankings/high-protein" className="hover:text-emerald-400 transition-colors">
                  Top High Protein
                </Link>
              </li>
              <li>
                <Link href="/rankings/low-calorie" className="hover:text-emerald-400 transition-colors">
                  Top Low Calorie
                </Link>
              </li>
              <li>
                <Link href="/rankings/high-fiber" className="hover:text-emerald-400 transition-colors">
                  Top High Fiber
                </Link>
              </li>
              <li>
                <Link href="/rankings/iron-rich" className="hover:text-emerald-400 transition-colors">
                  Top Iron-Rich Foods
                </Link>
              </li>
              <li>
                <Link href="/rankings/calcium-rich" className="hover:text-emerald-400 transition-colors">
                  Top Calcium-Rich Foods
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Feedback & Contact */}
        <section className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-5 sm:p-7 shadow-lg shadow-emerald-950/20">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                <Mail className="h-3.5 w-3.5" />
                Help us improve
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Found a bug or have a great idea?
              </h2>
              <p className="max-w-lg text-xs leading-relaxed text-slate-300">
                Tell the NutriBase team what needs fixing, what should be updated, or how we can make your nutrition journey better. Your email app will open with the message ready to send.
              </p>
              <p className="text-[11px] font-semibold text-emerald-300/80">
                Contact: hello@nutribase.app
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="grid gap-3 sm:grid-cols-2">
              <label className="text-[11px] font-bold text-slate-300">
                Message type
                <span className="relative mt-1.5 block">
                  <select
                    name="type"
                    className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-xs font-semibold text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                    defaultValue="Bug report"
                  >
                    <option>Bug report</option>
                    <option>Feature suggestion</option>
                    <option>Content update</option>
                    <option>Contact the team</option>
                  </select>
                </span>
              </label>
              <label className="text-[11px] font-bold text-slate-300">
                Your email (optional)
                <input
                  name="contact"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-xs font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                />
              </label>
              <label className="text-[11px] font-bold text-slate-300 sm:col-span-2">
                What should we know?
                <textarea
                  name="message"
                  required
                  rows={3}
                  placeholder="Describe the bug, update, or suggestion..."
                  className="mt-1.5 w-full resize-y rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-xs font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-emerald-950 transition hover:bg-emerald-400 sm:col-span-2"
              >
                <Send className="h-3.5 w-3.5" />
                Open email and send
              </button>
            </form>
          </div>
        </section>

        {/* Clinical Disclaimer Banner */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-200 font-bold">Clinical Nutrition Disclaimer:</strong> NutriBase provides objective reference data, calculators, and dietary calculations for general wellness and educational purposes only. It is not intended as medical advice or clinical diagnosis.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NutriBase Precision Intelligence Platform.</p>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <Link href="/search" className="hover:text-slate-200">
              Food Directory
            </Link>
            <Link href="/calculators" className="hover:text-slate-200">
              Calculators
            </Link>
            <Link href="/admin" className="hover:text-slate-200">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
