"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Apple,
  Scale,
  Calculator,
  Award,
  Sparkles,
  CalendarDays,
  Menu,
  X,
  ShieldCheck,
  Compass,
  Moon,
  Sun,
  Gamepad2,
  Flower2,
  NotebookPen,
  Droplets,
  PersonStanding,
  ChevronDown,
} from "lucide-react";
import { useNutri } from "@/context/NutriContext";

export function Navbar() {
  const pathname = usePathname();
  const { compareList, theme, toggleTheme } = useNutri();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const navLinks = [
    { label: "Explore Foods", href: "/search", icon: Compass },
    {
      label: "Find Foods For Me",
      href: "/discover",
      icon: Sparkles,
      badge: "Smart Match",
    },
    {
      label: "Compare",
      href: "/compare",
      icon: Scale,
      count: compareList.length,
    },
    { label: "Calculators", href: "/calculators", icon: Calculator },
    { label: "Top Ranking Foods", href: "/rankings", icon: Award },
    { label: "Tracker", href: "/tracker", icon: CalendarDays },
    { label: "Beauty Tips", href: "/beauty-tips", icon: Flower2 },
    { label: "Fun Quiz", href: "/quiz", icon: Gamepad2 },
    { label: "Notes & To-do", href: "/notes", icon: NotebookPen },
    { label: "Hydration", href: "/hydration", icon: Droplets },
    { label: "Body Guide", href: "/body-guide", icon: PersonStanding },
  ];
  const primaryLinks = navLinks.slice(0, 6);
  const moreLinks = navLinks.slice(6);
  const moreIsActive = moreLinks.some((link) => pathname === link.href);

  return (
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Apple className="w-5 h-5" />
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Nutri<span className="text-emerald-600">Base</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-extrabold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md ml-2 border border-emerald-200/80">
                Studio
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold tracking-tight transition-all ${
                    isActive
                      ? "text-emerald-700 bg-emerald-50 font-black border border-emerald-200/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  />
                  <span>{link.label}</span>
                  {link.count !== undefined && link.count > 0 && (
                    <span className="w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] flex items-center justify-center font-black">
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="relative">
              <button
                type="button"
                aria-expanded={moreMenuOpen}
                aria-haspopup="true"
                onClick={() => setMoreMenuOpen((open) => !open)}
                className={`flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  moreIsActive || moreMenuOpen
                    ? "border border-emerald-200/70 bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                More <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {moreMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  {moreLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMoreMenuOpen(false)}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                          isActive
                            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
                            : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Icon className="h-4 w-4 text-emerald-600" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="ml-1 p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-emerald-300 dark:hover:bg-slate-800 transition-colors"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <Link
              href="/admin"
              className="text-xs text-slate-400 hover:text-slate-700 ml-1 p-1.5 rounded-lg hover:bg-slate-100"
              title="Admin Food Manager"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-3 duration-200">
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            Switch to {theme === "light" ? "dark" : "light"} mode
          </button>
        </div>
      )}
    </header>
  );
}
