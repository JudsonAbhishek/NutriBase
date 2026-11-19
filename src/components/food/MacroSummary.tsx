"use client";

import React, { useState } from "react";
import { ChevronDown, Info, Database } from "lucide-react";
import { Macronutrients } from "@/types/nutrition";

interface MacroSummaryProps {
  nutrients: Macronutrients;
  grams: number;
  /** Label describing the basis, e.g. "100 g" or "1 bowl (150 g)" */
  basisLabel: string;
  dataSource?: string;
}

const ATWATER = { protein: 4, carbs: 4, fat: 9 } as const;

/** A nutrient the record simply does not report is shown as "—", never as 0. */
function fmt(value: number | undefined, unit: string, digits = 1) {
  if (value === undefined || value === null || Number.isNaN(value)) return null;
  const rounded = Math.round(value * 10 ** digits) / 10 ** digits;
  return `${rounded} ${unit}`;
}

function Ring({
  percent,
  grams,
  label,
  color,
}: {
  percent: number;
  grams: number;
  label: string;
  color: string;
}) {
  const r = 26;
  const circumference = 2 * Math.PI * r;
  const dash = (Math.min(100, percent) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[72px] w-[72px]">
        <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            strokeWidth="7"
            className="stroke-slate-200 dark:stroke-slate-700"
          />
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            stroke={color}
            strokeDasharray={`${dash} ${circumference - dash}`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-slate-900 dark:text-white">
          {percent}%
        </span>
      </div>
      <div className="text-center">
        <span className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
          {label}
        </span>
        <span className="block text-sm font-black text-slate-900 dark:text-white">
          {grams} g
        </span>
      </div>
    </div>
  );
}

export function MacroSummary({
  nutrients,
  grams,
  basisLabel,
  dataSource,
}: MacroSummaryProps) {
  const [showDetail, setShowDetail] = useState(false);

  const proteinKcal = nutrients.protein * ATWATER.protein;
  const carbKcal = nutrients.carbohydrates * ATWATER.carbs;
  const fatKcal = nutrients.fat * ATWATER.fat;
  // Percentages are derived from the macros themselves, so they always total 100
  // even where the record's stated calorie figure differs slightly from Atwater.
  const macroKcal = Math.max(1, proteinKcal + carbKcal + fatKcal);

  const pct = {
    protein: Math.round((proteinKcal / macroKcal) * 100),
    carbs: Math.round((carbKcal / macroKcal) * 100),
    fat: Math.round((fatKcal / macroKcal) * 100),
  };

  const segments = [
    { key: "carbs", label: "Carbs", color: "#f59e0b", pct: pct.carbs },
    { key: "protein", label: "Protein", color: "#3b82f6", pct: pct.protein },
    { key: "fat", label: "Fat", color: "#ef4444", pct: pct.fat },
  ];

  // Secondary values. `null` entries are omitted rather than rendered as zero.
  const secondary = [
    { label: "Dietary fiber", value: fmt(nutrients.fiber, "g") },
    { label: "Total sugar", value: fmt(nutrients.sugar, "g") },
    { label: "Net carbs", value: fmt(nutrients.netCarbs, "g") },
    { label: "Water", value: fmt(nutrients.water, "g") },
  ].filter((row) => row.value !== null);

  const detail = [
    { label: "Saturated fat", value: fmt(nutrients.saturatedFat, "g"), limit: true },
    { label: "Monounsaturated fat", value: fmt(nutrients.monounsaturatedFat, "g") },
    { label: "Polyunsaturated fat", value: fmt(nutrients.polyunsaturatedFat, "g") },
    { label: "Trans fat", value: fmt(nutrients.transFat, "g", 2), limit: true },
    { label: "Cholesterol", value: fmt(nutrients.cholesterolMg, "mg"), limit: true },
  ];
  const reportedDetail = detail.filter((row) => row.value !== null);
  const missingDetail = detail.filter((row) => row.value === null);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
            Macronutrients
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Per {basisLabel}
          </p>
        </div>
        <div className="text-right">
          <span className="block text-3xl font-black leading-none tracking-tight text-slate-900 dark:text-white">
            {nutrients.calories}
          </span>
          <span className="text-xs font-bold text-slate-400">kcal</span>
        </div>
      </div>

      {/* Stacked energy-contribution bar */}
      <div className="mt-5">
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          {segments.map((seg) => (
            <div
              key={seg.key}
              style={{ width: `${seg.pct}%`, backgroundColor: seg.color }}
              className="h-full first:rounded-l-full last:rounded-r-full"
            />
          ))}
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          {segments.map((seg) => (
            <span
              key={seg.key}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              {seg.label} {seg.pct}%
            </span>
          ))}
          <span className="ml-auto flex items-center gap-1 text-[10px] text-slate-400">
            <Info className="h-3 w-3" />% of energy
          </span>
        </div>
      </div>

      {/* Rings */}
      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
        <Ring percent={pct.carbs} grams={nutrients.carbohydrates} label="Carbs" color="#f59e0b" />
        <Ring percent={pct.protein} grams={nutrients.protein} label="Protein" color="#3b82f6" />
        <Ring percent={pct.fat} grams={nutrients.fat} label="Fat" color="#ef4444" />
      </div>

      {/* Secondary values */}
      {secondary.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 sm:grid-cols-4">
          {secondary.map((row) => (
            <div key={row.label} className="bg-white p-3 text-center dark:bg-slate-900">
              <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                {row.label}
              </dt>
              <dd className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* Expandable fat / cholesterol breakdown */}
      <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setShowDetail((v) => !v)}
          aria-expanded={showDetail}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-xs font-black uppercase tracking-wide text-slate-600 dark:text-slate-300">
            Fat &amp; cholesterol breakdown
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${showDetail ? "rotate-180" : ""}`}
          />
        </button>

        {showDetail && (
          <div className="mt-3 space-y-1.5">
            {reportedDetail.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70"
              >
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {row.label}
                  {row.limit && (
                    <span className="ml-1.5 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700 ring-1 ring-amber-200 dark:text-amber-300 dark:ring-amber-900">
                      limit
                    </span>
                  )}
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {row.value}
                </span>
              </div>
            ))}

            {missingDetail.length > 0 && (
              <p className="pt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Not reported for this food:{" "}
                <span className="font-semibold">
                  {missingDetail.map((row) => row.label.toLowerCase()).join(", ")}
                </span>
                . Missing values are left blank rather than shown as zero.
              </p>
            )}

            {dataSource && (
              <p className="flex items-center gap-1.5 pt-2 text-[11px] text-slate-400">
                <Database className="h-3 w-3" />
                Values scaled from {dataSource} for a {grams} g portion.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
