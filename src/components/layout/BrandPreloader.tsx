"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function BrandPreloader() {
  const pathname = usePathname();
  const hasPlayed = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (pathname !== "/" || hasPlayed.current) return;

    hasPlayed.current = true;
    setIsVisible(true);

    const leaveTimer = window.setTimeout(() => setIsLeaving(true), 1250);
    const hideTimer = window.setTimeout(() => setIsVisible(false), 1550);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div
      aria-label="Loading NutriBase"
      aria-live="polite"
      role="status"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-slate-950 transition-opacity duration-300 ${
        isLeaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <p className="brand-preloader-wordmark text-5xl sm:text-6xl font-black tracking-[-0.06em] text-slate-900 dark:text-white">
          Nutri<span className="text-emerald-600 dark:text-emerald-400">Base</span>
        </p>
        <div className="h-1 w-36 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="brand-preloader-progress h-full rounded-full bg-emerald-500" />
        </div>
      </div>
    </div>
  );
}
