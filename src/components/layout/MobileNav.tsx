"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Sparkles, Scale, CalendarDays } from "lucide-react";
import { useNutri } from "@/context/NutriContext";

export function MobileNav() {
  const pathname = usePathname();
  const { compareList } = useNutri();

  const links = [
    { label: "Home", href: "/", icon: Home },
    { label: "Explore", href: "/search", icon: Search },
    { label: "Find For Me", href: "/discover", icon: Sparkles, highlight: true },
    { label: "Compare", href: "/compare", icon: Scale, count: compareList.length },
    { label: "Tracker", href: "/tracker", icon: CalendarDays },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 sm:px-3 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] shadow-lg shadow-slate-900/10">
      <div className="flex items-center justify-around">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                link.highlight
                  ? "text-brand-600 font-bold"
                  : isActive
                  ? "text-brand-600 font-semibold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${link.highlight ? "text-brand-600 scale-110" : ""}`} />
                {link.count !== undefined && link.count > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-brand-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                    {link.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
